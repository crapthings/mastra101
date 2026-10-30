# 19 身份与权限

此包使用 TypeScript；Node.js >=24，pnpm 12。安装：`pnpm install --frozen-lockfile`。

六个入口均自行启动回环 HTTP 服务，完成后关闭；不请求模型，不连接真实身份服务：

- `node src/02-provider.ts`：无凭证、错误凭证、有效成员凭证。
- `node src/03-tokens.ts`：真实 MastraJwtAuth 验证有效、过期、错误签名的 JWT。
- `node src/04-context.ts`：认证身份覆盖调用方伪造的 user。
- `node src/05-routes.ts`：公开业务、成员业务与内置 API 的保护范围。
- `node src/06-roles.ts`：成员发布 403，工作人员发布 200。
- `node src/07-scope.ts`：列表、单条读取和发布均检查团队归属。

`policy.ts` 保存公开教学令牌与业务权限表；`routes.ts` 在真实操作前检查角色和记录范围；`lab.ts` 安装原生 SimpleAuth 与 HTTP 适配器。JWT 密钥随机生成，不打印或保存。过期和错误签名测试可能输出 SDK 认证错误日志，这是预期拒绝。

成员甲属于 team-a，成员乙属于 team-b，工作人员甲也属于 team-a。发布操作仅修改当前进程的教学记录，不发送真实通知。内存 LibSQL 和业务数组退出清空，每个入口独立创建实验数据。

角色表是应用业务规则，并未启用企业版 server.rbac。teamId 筛选也不是在模拟已接入 server.fga；企业版 FGA 与存储范围配置有各自的功能和许可条件。

mapUserToResourceId 由认证身份设置内置资源归属，不会自动过滤本例业务通知。客户端自报 userId 不能代替认证后 user。公开路由只返回已发布内容。

SimpleAuth 不自动提供过期刷新机制。JWT 格式本身不加密声明，示例只验证签名和到期，不代表生产签发策略已经完整。
