// Lightweight metadata keeps the directory independent of lesson content.
export const chapters = [
  {
    id: 'llm',
    lessons: [
      { id: 'intro', path: '/llm' },
      { id: 'training', path: '/llm/training' },
      { id: 'messages', path: '/llm/messages' },
      { id: 'context', path: '/llm/context' },
      { id: 'attention', path: '/llm/attention' },
      { id: 'hallucination', path: '/llm/hallucination' },
      { id: 'knowledge', path: '/llm/knowledge' },
      { id: 'tools', path: '/llm/tools' },
      { id: 'loop', path: '/llm/loop' }
    ]
  },
  {
    id: 'framework',
    lessons: [
      { id: 'task-state', path: '/framework' },
      { id: 'memory', path: '/framework/memory' },
      { id: 'workflow', path: '/framework/workflow' },
      { id: 'harness', path: '/framework/harness' },
      { id: 'quality', path: '/framework/quality' },
      { id: 'framework-choice', path: '/framework/organization' },
      { id: 'understanding', path: '/framework/mastra' }
    ]
  },
  {
    id: 'agent',
    lessons: [
      { id: 'providers', path: '/agent/providers' },
      { id: 'setup', path: '/agent/setup' },
      { id: 'first', path: '/agent/first' },
      { id: 'time-tool', path: '/agent/tool' },
      { id: 'execution', path: '/agent/execution' },
      { id: 'troubleshooting', path: '/agent/verify' }
    ]
  },
  {
    id: 'core',
    lessons: [
      { id: 'core-agent', path: '/core' },
      { id: 'core-tools', path: '/core/tools' },
      { id: 'core-context', path: '/core/context' },
      { id: 'core-memory', path: '/core/memory' },
      { id: 'core-workflow', path: '/core/workflow' },
      { id: 'core-control', path: '/core/control' },
      { id: 'core-skills', path: '/core/skills' },
      { id: 'core-evaluation', path: '/core/evaluation' }
    ]
  },
  {
    id: 'prompts',
    lessons: [
      { id: 'input-studio', path: '/prompts' },
      { id: 'input-system', path: '/prompts/system' },
      { id: 'input-task', path: '/prompts/user' },
      { id: 'input-roles', path: '/prompts/roles' },
      { id: 'input-tone', path: '/prompts/tone' },
      { id: 'input-materials', path: '/prompts/materials' },
      { id: 'input-styles', path: '/prompts/structured-input' },
      { id: 'input-output', path: '/prompts/structured-output' },
      { id: 'input-markers', path: '/prompts/markers' },
      { id: 'input-iteration', path: '/prompts/iteration' }
    ]
  },
  {
    id: 'modalities',
    lessons: [
      { id: 'input-modalities', path: '/modalities' },
      { id: 'input-text', path: '/modalities/text' },
      { id: 'input-document', path: '/modalities/document' },
      { id: 'input-image', path: '/modalities/image' },
      { id: 'input-audio', path: '/modalities/audio' },
      { id: 'input-video', path: '/modalities/video' },
      { id: 'input-combined', path: '/modalities/combined' },
      { id: 'input-generation', path: '/modalities/generation', optional: true },
      { id: 'input-multimodal', path: '/modalities/multimodal', optional: true },
      { id: 'input-embedding', path: '/modalities/embedding', optional: true },
      { id: 'input-planning', path: '/modalities/planning', optional: true },
      { id: 'input-specialists', path: '/modalities/specialists', optional: true },
      { id: 'input-world-models', path: '/modalities/world-models', optional: true }
    ]
  },
  {
    id: 'agents',
    lessons: [
      { id: 'agent-responsibility', path: '/agents' },
      { id: 'agent-model-settings', path: '/agents/model-settings' },
      { id: 'agent-request-context', path: '/agents/request-context' },
      { id: 'agent-tool-loop', path: '/agents/tools' },
      { id: 'agent-run-control', path: '/agents/control' },
      { id: 'agent-structured', path: '/agents/structured-output' },
      { id: 'agent-streaming', path: '/agents/streaming' },
      { id: 'agent-processors', path: '/agents/processors' },
      { id: 'agent-guardrails', path: '/agents/guardrails' },
      { id: 'agent-recovery', path: '/agents/recovery' },
      { id: 'agent-approval', path: '/agents/approval' },
      { id: 'agent-code-mode', path: '/agents/code-mode' },
      { id: 'agent-review', path: '/agents/review' }
    ]
  },
  {
    id: 'memory',
    lessons: [
      { id: 'memory-config', path: '/memory' },
      { id: 'memory-identity', path: '/memory/threads' },
      { id: 'memory-history', path: '/memory/history' },
      { id: 'memory-working', path: '/memory/working' },
      { id: 'memory-recall', path: '/memory/recall' },
      { id: 'memory-context', path: '/memory/context' },
      { id: 'memory-observation', path: '/memory/observational' },
      { id: 'memory-storage', path: '/memory/storage' },
      { id: 'memory-verification', path: '/memory/review' }
    ]
  },
  {
    id: 'storage',
    lessons: [
      { id: 'storage-persistence', path: '/storage' },
      { id: 'storage-scope', path: '/storage/scope' },
      { id: 'storage-domains', path: '/storage/domains' },
      { id: 'storage-adapters', path: '/storage/adapters' },
      { id: 'storage-vector', path: '/storage/vector' },
      { id: 'storage-composite', path: '/storage/composite' },
      { id: 'storage-retention', path: '/storage/retention' }
    ]
  },
  {
    id: 'workflows',
    lessons: [
      { id: 'workflow-basics', path: '/workflows' },
      { id: 'workflow-schemas', path: '/workflows/schemas' },
      { id: 'workflow-sequence', path: '/workflows/sequential' },
      { id: 'workflow-branch', path: '/workflows/branching' },
      { id: 'workflow-parallel', path: '/workflows/parallel' },
      { id: 'workflow-resume', path: '/workflows/resume' },
      { id: 'workflow-errors', path: '/workflows/errors' },
      { id: 'workflow-agents', path: '/workflows/agents' }
    ]
  },
  {
    id: 'skills',
    lessons: [
      { id: 'skill-responsibility', path: '/skills' },
      { id: 'skill-definition', path: '/skills/definition' },
      { id: 'skill-loading', path: '/skills/loading' },
      { id: 'skill-files', path: '/skills/files' },
      { id: 'skill-resources', path: '/skills/resources' },
      { id: 'skill-dynamic', path: '/skills/dynamic' },
      { id: 'skill-verification', path: '/skills/review' }
    ]
  },
  {
    id: 'workspace',
    lessons: [
      { id: 'workspace-config', path: '/workspace' },
      { id: 'workspace-paths', path: '/workspace/paths' },
      { id: 'workspace-files', path: '/workspace/files' },
      { id: 'workspace-search', path: '/workspace/search' },
      { id: 'workspace-skills', path: '/workspace/skills' },
      { id: 'workspace-scope', path: '/workspace/scope' },
      { id: 'workspace-artifacts', path: '/workspace/artifacts' }
    ]
  },
  {
    id: 'sandbox',
    lessons: [
      { id: 'sandbox-runtime', path: '/sandbox' },
      { id: 'sandbox-results', path: '/sandbox/results' },
      { id: 'sandbox-environment', path: '/sandbox/environment' },
      { id: 'sandbox-code', path: '/sandbox/code' },
      { id: 'sandbox-processes', path: '/sandbox/processes' },
      { id: 'sandbox-isolation', path: '/sandbox/isolation' },
      { id: 'sandbox-lifecycle', path: '/sandbox/lifecycle' }
    ]
  },
  {
    id: 'subagents',
    lessons: [
      { id: 'subagent-config', path: '/subagents' },
      { id: 'subagent-description', path: '/subagents/description' },
      { id: 'subagent-context', path: '/subagents/context' },
      { id: 'subagent-results', path: '/subagents/results' },
      { id: 'subagent-hooks', path: '/subagents/hooks' },
      { id: 'subagent-budgets', path: '/subagents/budgets' },
      { id: 'subagent-memory', path: '/subagents/memory' },
      { id: 'subagent-verification', path: '/subagents/review' }
    ]
  },
  {
    id: 'connections',
    lessons: [
      { id: 'connection-types', path: '/connections' },
      { id: 'connection-tools', path: '/connections/mcp' },
      { id: 'connection-transports', path: '/connections/transports' },
      { id: 'connection-resources', path: '/connections/resources' },
      { id: 'connection-credentials', path: '/connections/credentials' },
      { id: 'connection-approval', path: '/connections/approval' },
      { id: 'connection-server', path: '/connections/server' },
      { id: 'connection-a2a', path: '/connections/a2a', optional: true },
      { id: 'connection-runtimes', path: '/connections/runtimes', optional: true }
    ]
  },
  {
    id: 'observability',
    lessons: [
      { id: 'observe-config', path: '/observability' },
      { id: 'observe-spans', path: '/observability/spans' },
      { id: 'observe-context', path: '/observability/context' },
      { id: 'observe-outcomes', path: '/observability/outcomes' },
      { id: 'observe-logs', path: '/observability/logs' },
      { id: 'observe-capture', path: '/observability/capture' },
      { id: 'observe-metrics', path: '/observability/metrics' },
      { id: 'observe-diagnosis', path: '/observability/diagnosis' }
    ]
  },
  {
    id: 'evals',
    lessons: [
      { id: 'eval-criteria', path: '/evals' },
      { id: 'eval-checks', path: '/evals/checks' },
      { id: 'eval-scorers', path: '/evals/scorers' },
      { id: 'eval-judges', path: '/evals/judges' },
      { id: 'eval-datasets', path: '/evals/datasets' },
      { id: 'eval-batch', path: '/evals/batch' },
      { id: 'eval-gates', path: '/evals/gates' },
      { id: 'eval-live', path: '/evals/live' },
      { id: 'eval-experiments', path: '/evals/experiments' }
    ]
  },
  {
    id: 'server',
    lessons: [
      { id: 'server-config', path: '/server' },
      { id: 'server-routes', path: '/server/routes' },
      { id: 'server-client', path: '/server/client' },
      { id: 'server-context', path: '/server/context' },
      { id: 'server-streaming', path: '/server/streaming' },
      { id: 'server-workflows', path: '/server/workflows' },
      { id: 'server-custom', path: '/server/custom' },
      { id: 'server-middleware', path: '/server/middleware' },
      { id: 'server-cancellation', path: '/server/cancellation' }
    ]
  },
  {
    id: 'auth',
    lessons: [
      { id: 'auth-boundaries', path: '/auth' },
      { id: 'auth-provider', path: '/auth/provider' },
      { id: 'auth-tokens', path: '/auth/tokens' },
      { id: 'auth-context', path: '/auth/context' },
      { id: 'auth-routes', path: '/auth/routes' },
      { id: 'auth-roles', path: '/auth/roles' },
      { id: 'auth-scope', path: '/auth/scope' }
    ]
  },
  {
    id: 'deployment',
    lessons: [
      { id: 'deploy-runtime', path: '/deployment' },
      { id: 'deploy-config', path: '/deployment/config' },
      { id: 'deploy-artifact', path: '/deployment/artifact' },
      { id: 'deploy-persistence', path: '/deployment/persistence' },
      { id: 'deploy-workers', path: '/deployment/workers' },
      { id: 'deploy-health', path: '/deployment/health' },
      { id: 'deploy-shutdown', path: '/deployment/shutdown' },
      { id: 'deploy-release', path: '/deployment/release' }
    ]
  },
  {
    id: 'rag',
    lessons: [
      { id: 'rag-pipeline', path: '/rag' },
      { id: 'rag-documents', path: '/rag/documents' },
      { id: 'rag-chunking', path: '/rag/chunking' },
      { id: 'rag-embedding', path: '/rag/embedding' },
      { id: 'rag-index', path: '/rag/index' },
      { id: 'rag-retrieval', path: '/rag/retrieval' },
      { id: 'rag-reranking', path: '/rag/reranking' },
      { id: 'rag-grounding', path: '/rag/grounding' },
      { id: 'rag-evaluation', path: '/rag/evaluation' }
    ]
  },
  {
    id: 'harness',
    lessons: [
      { id: 'harness-runtime', path: '/harness' },
      { id: 'harness-durable', path: '/harness/durable' },
      { id: 'harness-observe', path: '/harness/observe' },
      { id: 'harness-thread-streams', path: '/harness/thread-streams' },
      { id: 'harness-signals', path: '/harness/signals' },
      { id: 'harness-state', path: '/harness/state' },
      { id: 'harness-goals', path: '/harness/goals' },
      { id: 'harness-tasks', path: '/harness/tasks' },
      { id: 'harness-case', path: '/harness/case' },
      { id: 'harness-background', path: '/harness/background', optional: true },
      { id: 'harness-notifications', path: '/harness/notifications', optional: true },
      { id: 'harness-providers', path: '/harness/providers', optional: true },
      { id: 'harness-schedules', path: '/harness/schedules', optional: true },
      { id: 'harness-controller', path: '/harness/controller', optional: true },
      { id: 'harness-coordination', path: '/harness/coordination', optional: true },
      { id: 'harness-recovery', path: '/harness/recovery', optional: true }
    ]
  }
]
