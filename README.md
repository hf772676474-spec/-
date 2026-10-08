# 森愈智行

基于环境心理学的森林康养与自然教育智能推荐系统。第一阶段采用纯前端架构：React、TypeScript、Vite、Tailwind CSS，以及由本地 Excel 知识库生成的 JSON 数据。

## 已实现

- 读取三份 Excel、15 个工作表，并保留全部 126 条非表头记录及来源行号。
- 建立核心文献、六类人群、环境指标、筛选规则、秦岭场地/分段和调查清单 JSON。
- 建立“人群识别 → 环境参数匹配 → 秦岭场地筛选 → 活动建议 → 文献溯源”规则引擎。
- 明确区分“文献证据”“初步设计建议”“待核实信息”。所有待测、待核和未知值保持未知。
- 使用 HashRouter 与相对资源路径，可直接适配 GitHub Pages 子路径部署。

## 本地运行

项目使用 pnpm：

```powershell
pnpm install
pnpm dev
```

打开终端显示的本地地址，通常为 `http://localhost:5173/`。

生产预览：

```powershell
pnpm build
pnpm preview
```

生产预览地址通常为 `http://localhost:4173/`。

## 重新生成知识库

先安装 Python 依赖，再运行转换脚本：

```powershell
python -m pip install -r requirements.txt
python scripts/convert_excel.py
```

转换结果位于 `src/data/`。`raw-workbooks.json` 保存全部原始表记录，其余 JSON 为应用使用的结构化数据库。

## 验证

```powershell
pnpm test
pnpm build
```

推荐结果仅作研究与设计原型，不构成医疗处方或实时出行许可。出行前需核实景区公告、天气、交通、开放路段与个人安全条件。
