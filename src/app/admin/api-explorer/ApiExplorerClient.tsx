'use client';

import { useMemo, useState } from 'react';
import { API_ENDPOINTS, API_GROUPS, ApiEndpoint, HttpMethod } from '@/lib/api-catalog';
import { API_ENVIRONMENTS, ApiEnvironmentId } from '@/lib/api-environments';
import Card, { CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

interface QueryRow {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface ExplorerResponse {
  ok: boolean;
  status: number;
  statusText: string;
  durationMs: number;
  url: string;
  data?: unknown;
  error?: string;
}

type RequestTab = 'params' | 'body' | 'auth';
type ViewMode = 'split' | 'catalog';

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const METHOD_BADGE: Record<HttpMethod, 'success' | 'warning' | 'info' | 'purple' | 'error'> = {
  GET: 'success',
  POST: 'warning',
  PUT: 'info',
  PATCH: 'purple',
  DELETE: 'error',
};

function newQueryRow(key = '', value = '') {
  return { id: `${Date.now()}-${Math.random()}`, key, value, enabled: true };
}

function buildQueryRows(endpoint?: ApiEndpoint | null): QueryRow[] {
  if (!endpoint?.query?.length) return [newQueryRow()];
  return endpoint.query.map((q) => newQueryRow(q.key, q.value));
}

function formatJson(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
}

function buildFullUrl(baseUrl: string, path: string, query: Record<string, string>) {
  const base = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (k.trim()) params.set(k, v);
  });
  const qs = params.toString();
  return `${base}${normalizedPath}${qs ? `?${qs}` : ''}`;
}

function EndpointRow({
  endpoint,
  active,
  onSelect,
}: {
  endpoint: ApiEndpoint;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-xl px-3 py-2.5 transition-all border ${
        active
          ? 'border-[#6D28D9]/40 bg-gradient-to-r from-purple-50 to-white shadow-sm ring-1 ring-purple-100'
          : 'border-transparent hover:border-purple-100 hover:bg-purple-50/40'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Badge variant={METHOD_BADGE[endpoint.method]} size="sm">
          {endpoint.method}
        </Badge>
        <span className="text-sm font-medium text-gray-800 truncate">{endpoint.name}</span>
      </div>
      <p className="text-xs font-mono text-gray-400 truncate mt-1">{endpoint.path}</p>
    </button>
  );
}

export default function ApiExplorerClient() {
  const [environment, setEnvironment] = useState<ApiEnvironmentId>('development');
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [requestTab, setRequestTab] = useState<RequestTab>('params');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [selectedId, setSelectedId] = useState(API_ENDPOINTS[0]?.id ?? '');
  const [method, setMethod] = useState<HttpMethod>(API_ENDPOINTS[0]?.method ?? 'GET');
  const [path, setPath] = useState(API_ENDPOINTS[0]?.path ?? '/health');
  const [queryRows, setQueryRows] = useState<QueryRow[]>(buildQueryRows(API_ENDPOINTS[0]));
  const [body, setBody] = useState(() => formatJson(API_ENDPOINTS[0]?.bodyExample));
  const [useAuth, setUseAuth] = useState(API_ENDPOINTS[0]?.auth ?? true);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ExplorerResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const envConfig = API_ENVIRONMENTS.find((e) => e.id === environment)!;
  const selectedEndpoint = API_ENDPOINTS.find((e) => e.id === selectedId) ?? null;

  const filteredEndpoints = useMemo(() => {
    const q = search.trim().toLowerCase();
    return API_ENDPOINTS.filter((endpoint) => {
      if (groupFilter && endpoint.group !== groupFilter) return false;
      if (!q) return true;
      return (
        endpoint.name.toLowerCase().includes(q) ||
        endpoint.path.toLowerCase().includes(q) ||
        endpoint.method.toLowerCase().includes(q) ||
        endpoint.group.toLowerCase().includes(q)
      );
    });
  }, [search, groupFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, ApiEndpoint[]>();
    for (const endpoint of filteredEndpoints) {
      const list = map.get(endpoint.group) ?? [];
      list.push(endpoint);
      map.set(endpoint.group, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filteredEndpoints]);

  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    API_ENDPOINTS.forEach((e) => {
      counts[e.group] = (counts[e.group] ?? 0) + 1;
    });
    return counts;
  }, []);

  const queryObject = useMemo(() => {
    const query: Record<string, string> = {};
    queryRows.forEach((row) => {
      if (row.enabled && row.key.trim()) query[row.key.trim()] = row.value;
    });
    return query;
  }, [queryRows]);

  const fullUrl = useMemo(
    () => buildFullUrl(envConfig.baseUrl, path, queryObject),
    [envConfig.baseUrl, path, queryObject]
  );

  const selectEndpoint = (endpoint: ApiEndpoint) => {
    setSelectedId(endpoint.id);
    setMethod(endpoint.method);
    setPath(endpoint.path);
    setQueryRows(buildQueryRows(endpoint));
    setBody(formatJson(endpoint.bodyExample));
    setUseAuth(endpoint.auth);
    setResponse(null);
    setRequestTab(endpoint.bodyExample ? 'body' : 'params');
    setViewMode('split');
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const expandAll = () => setCollapsedGroups({});
  const collapseAll = () => {
    const all: Record<string, boolean> = {};
    grouped.forEach(([g]) => {
      all[g] = true;
    });
    setCollapsedGroups(all);
  };

  const updateQueryRow = (id: string, patch: Partial<QueryRow>) => {
    setQueryRows((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);

    let parsedBody: unknown | undefined;
    if (method !== 'GET' && method !== 'DELETE' && body.trim()) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        setLoading(false);
        setResponse({
          ok: false,
          status: 0,
          statusText: 'Invalid JSON',
          durationMs: 0,
          url: fullUrl,
          error: 'Request body must be valid JSON',
        });
        return;
      }
    }

    try {
      const res = await fetch('/api/explorer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          environment,
          method,
          path,
          query: queryObject,
          body: parsedBody,
          useAuth,
        }),
      });
      setResponse((await res.json()) as ExplorerResponse);
    } catch (error) {
      setResponse({
        ok: false,
        status: 0,
        statusText: 'Network Error',
        durationMs: 0,
        url: fullUrl,
        error: error instanceof Error ? error.message : 'Request failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const showBody = method !== 'GET' && method !== 'DELETE';

  const groupListContent = (
    <div className="space-y-1">
      {grouped.map(([group, endpoints]) => {
        const collapsed = collapsedGroups[group] ?? false;
        return (
          <div key={group}>
            <button
              type="button"
              onClick={() => toggleGroup(group)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-purple-50/60 text-left"
            >
              <ChevronIcon
                className={`w-4 h-4 text-[#8B5CF6] shrink-0 transition-transform ${collapsed ? '' : 'rotate-90'}`}
              />
              <span className="text-xs font-semibold text-gray-700 truncate flex-1">{group}</span>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                {endpoints.length}
              </span>
            </button>
            {!collapsed && (
              <div className="space-y-1 pl-1 pb-2">
                {endpoints.map((endpoint) => (
                  <EndpointRow
                    key={endpoint.id}
                    endpoint={endpoint}
                    active={selectedId === endpoint.id}
                    onSelect={() => selectEndpoint(endpoint)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
      {grouped.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No endpoints match</p>
      )}
    </div>
  );

  const catalogGrid = (
    <div className="space-y-4">
      {grouped.map(([group, endpoints]) => (
        <Card key={group} hover className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <CardTitle className="text-base">{group}</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">{endpoints.length} endpoints</p>
            </div>
            <Badge variant="purple">{endpoints.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {endpoints.map((endpoint) => (
              <EndpointRow
                key={endpoint.id}
                endpoint={endpoint}
                active={selectedId === endpoint.id}
                onSelect={() => selectEndpoint(endpoint)}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  const requestPanel = (
    <div className="flex flex-col min-h-[480px] bg-white/60">
      {selectedEndpoint && (
        <div className="px-4 py-3 border-b border-purple-100 bg-gradient-to-r from-purple-50/40 to-white shrink-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={METHOD_BADGE[method]}>{method}</Badge>
            <span className="text-sm font-semibold text-gray-900">{selectedEndpoint.name}</span>
            <span className="text-xs text-gray-400">· {selectedEndpoint.group}</span>
          </div>
          <div className="flex gap-2">
            <code className="flex-1 text-xs font-mono text-gray-600 bg-white border border-purple-100 rounded-xl px-3 py-2 break-all">
              {fullUrl}
            </code>
            <Button variant="secondary" size="sm" onClick={copyUrl}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
      )}

      <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap gap-2 items-center shrink-0">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
          className="h-10 w-24 px-2 text-sm font-bold rounded-xl border border-gray-200 bg-gray-50 text-[#6D28D9] outline-none focus:ring-2 focus:ring-[#6D28D9]/30"
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="flex-1 min-w-[160px] h-10 px-3 text-sm font-mono border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#6D28D9]/30"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600 shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={useAuth}
            onChange={(e) => setUseAuth(e.target.checked)}
            className="rounded border-gray-300 text-[#6D28D9]"
          />
          Bearer
        </label>
        <Button variant="gradient" onClick={handleSend} loading={loading} className="shrink-0">
          Send
        </Button>
      </div>

      <div className="border-b border-gray-100 px-4 shrink-0">
        <div className="flex gap-1">
          {(['params', ...(showBody ? (['body'] as const) : []), 'auth'] as RequestTab[]).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setRequestTab(tab)}
                className={`px-3 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px ${
                  requestTab === tab
                    ? 'border-[#6D28D9] text-[#6D28D9]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'params' ? 'Query' : tab}
              </button>
            )
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">
        <div className="p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-100">
          {requestTab === 'params' && (
            <div className="space-y-2">
              {queryRows.map((row) => (
                <div key={row.id} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={row.enabled}
                    onChange={(e) => updateQueryRow(row.id, { enabled: e.target.checked })}
                    className="rounded border-gray-300 text-[#6D28D9]"
                  />
                  <Input
                    placeholder="Key"
                    value={row.key}
                    onChange={(e) => updateQueryRow(row.id, { key: e.target.value })}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={row.value}
                    onChange={(e) => updateQueryRow(row.id, { value: e.target.value })}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setQueryRows((rows) =>
                        rows.length <= 1 ? rows : rows.filter((r) => r.id !== row.id)
                      )
                    }
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setQueryRows((rows) => [...rows, newQueryRow()])}
                className="text-sm text-[#6D28D9] font-medium hover:underline"
              >
                + Add parameter
              </button>
            </div>
          )}
          {requestTab === 'body' && showBody && (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              spellCheck={false}
              rows={12}
              className="w-full font-mono text-sm p-4 bg-gray-900 text-emerald-400 rounded-2xl outline-none focus:ring-2 focus:ring-[#6D28D9]/40 border border-gray-800"
            />
          )}
          {requestTab === 'auth' && (
            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4 text-sm text-gray-600">
              {useAuth
                ? 'Admin Bearer token is attached automatically.'
                : 'Auth off — for public routes only.'}
            </div>
          )}
        </div>

        <div className="flex flex-col min-h-[200px] bg-gradient-to-b from-gray-50/80 to-white">
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2 shrink-0">
            <span className="text-sm font-bold text-gray-900">Response</span>
            {response && (
              <>
                <Badge variant={response.ok ? 'success' : 'error'} dot>
                  {response.status} {response.statusText}
                </Badge>
                <span className="text-xs text-gray-400">{response.durationMs} ms</span>
              </>
            )}
          </div>
          <div className="flex-1 overflow-auto p-4">
            {!response ? (
              <p className="text-sm text-gray-400 text-center py-10">Send to see response</p>
            ) : (
              <pre className="text-xs font-mono text-emerald-400 bg-gray-900 rounded-2xl p-4 overflow-x-auto border border-gray-800">
                {response.error && (
                  <span className="block text-red-400 mb-2">{response.error}</span>
                )}
                {formatJson(response.data ?? response)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Explorer</h1>
          <p className="text-gray-500 mt-1">
            {API_ENDPOINTS.length} endpoints in {API_GROUPS.length} groups
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex h-10 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
            {API_ENVIRONMENTS.map((env) => (
              <button
                key={env.id}
                type="button"
                onClick={() => setEnvironment(env.id)}
                className={`px-4 text-sm font-semibold rounded-lg transition-colors ${
                  environment === env.id
                    ? env.id === 'production'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {env.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <code className="block text-xs font-mono text-gray-500 bg-white border border-purple-100 rounded-xl px-4 py-2.5 break-all">
        Base URL: <span className="text-[#6D28D9] font-semibold">{envConfig.baseUrl}</span>
      </code>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search all endpoints…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2 shrink-0">
          <Button
            variant={viewMode === 'split' ? 'gradient' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('split')}
          >
            Split view
          </Button>
          <Button
            variant={viewMode === 'catalog' ? 'gradient' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('catalog')}
          >
            All groups
          </Button>
        </div>
      </div>

      {/* Group chips */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setGroupFilter('')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            !groupFilter
              ? 'bg-[#6D28D9] text-white border-[#6D28D9]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-purple-200'
          }`}
        >
          All ({API_ENDPOINTS.length})
        </button>
        {API_GROUPS.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => setGroupFilter(groupFilter === group ? '' : group)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              groupFilter === group
                ? 'bg-[#6D28D9] text-white border-[#6D28D9]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-200'
            }`}
          >
            {group} ({groupCounts[group] ?? 0})
          </button>
        ))}
      </div>

      <div className="flex gap-2 text-xs">
        <button type="button" onClick={expandAll} className="text-[#6D28D9] hover:underline">
          Expand all
        </button>
        <span className="text-gray-300">|</span>
        <button type="button" onClick={collapseAll} className="text-gray-500 hover:underline">
          Collapse all
        </button>
        <span className="text-gray-400 ml-auto">{filteredEndpoints.length} shown</span>
      </div>

      {viewMode === 'catalog' ? (
        <>
          {catalogGrid}
          <Card padding="none" className="overflow-hidden mt-6">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <CardTitle className="text-base">Try selected endpoint</CardTitle>
            </div>
            {requestPanel}
          </Card>
        </>
      ) : (
        <Card padding="none" className="overflow-hidden shadow-sm">
          <div className="flex flex-col xl:flex-row min-h-[640px]">
            {/* Sidebar — always visible */}
            <aside className="xl:w-[320px] shrink-0 border-b xl:border-b-0 xl:border-r border-purple-100 max-h-[420px] xl:max-h-none xl:min-h-[640px] overflow-y-auto bg-gradient-to-b from-purple-50/30 to-white">
              <div className="p-3 border-b border-purple-100/80 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Endpoints by group
                </p>
              </div>
              <div className="p-2">{groupListContent}</div>
            </aside>
            <div className="flex-1 min-w-0">{requestPanel}</div>
          </div>
        </Card>
      )}
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
