# Running Page Strava 配置说明

当前目标仓库：

- `https://github.com/imjasondai/running_page`

推荐最终访问地址：

- `https://imjasondai.github.io/running_page`

这个副本已经替你预设了以下默认值：

- `.github/workflows/run_data_sync.yml` 已切到 `RUN_TYPE: strava`
- Strava 同步命令已默认加上 `--only-run`
- `src/static/site-metadata.ts` 已指向你的 GitHub 仓库和 GitHub Pages 地址
- `src/utils/const.ts` 已开启 `PRIVACY_MODE = true`

## 1. 这个项目是从哪里抓 Strava 数据的

这个项目不是前端页面直接请求 Strava。

实际的数据链路是：

1. `run_page/strava_sync.py`
2. `run_page/generator/__init__.py`
3. 通过 `stravalib.Client()` 调用 Strava API
4. 用 `client.get_activities(...)` 拉取你的活动数据
5. 写入本地数据库 `run_page/data.db`
6. 再导出成前端读取的 `src/static/activities.json`
7. 同时生成 `assets/github.svg`、`assets/grid.svg` 等统计图

你真正需要配置的 Strava 凭证只有这 3 个：

- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `STRAVA_CLIENT_REFRESH_TOKEN`

对应代码入口：

- `run_page/strava_sync.py`
- `.github/workflows/run_data_sync.yml`

## 2. 你要去哪里拿 Strava 凭证

先去 Strava 开发者页面创建自己的 API 应用：

- `https://www.strava.com/settings/api`

创建完成后你会拿到：

- `Client ID`
- `Client Secret`

然后用下面这个授权链接换取 `code`，把 `${your_id}` 换成你的 `Client ID`：

```text
https://www.strava.com/oauth/authorize?client_id=${your_id}&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read_all,profile:read_all,activity:read_all,profile:write,activity:write
```

浏览器跳转到：

```text
http://localhost/exchange_token?state=&code=xxxxxx&scope=...
```

把里面的 `code` 取出来，再执行：

```bash
curl -X POST https://www.strava.com/oauth/token \
  -F client_id=你的ClientID \
  -F client_secret=你的ClientSecret \
  -F code=刚才拿到的Code \
  -F grant_type=authorization_code
```

返回结果里会有：

- `access_token`
- `refresh_token`

这里你要保存的是 `refresh_token`，也就是后面要配置的 `STRAVA_CLIENT_REFRESH_TOKEN`。

## 3. 在这个副本里你要改哪些地方

### GitHub Actions 运行参数

文件：

- `.github/workflows/run_data_sync.yml`

重点改这些 `env`：

- `RUN_TYPE`: 改成 `strava`
- `ATHLETE`: 改成你的名字或昵称
- `TITLE`: 改成你的页面标题
- `MIN_GRID_DISTANCE`: 统计图最小展示距离
- `TITLE_GRID`: 网格图标题
- `BIRTHDAY_MONTH`: 如果要生成 month of life，改成你的出生年月，格式 `YYYY-MM`

### 仓库 Secrets

在 GitHub 仓库 `Settings -> Secrets and variables -> Actions` 新增：

- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `STRAVA_CLIENT_REFRESH_TOKEN`

这 3 个是你跑通 Strava 同步的最小必要项。

首次同步建议保留工作流里的这两个默认值：

- `DISABLE_REVERSE_GEOCODE: true`
- `REVERSE_GEOCODE_TIMEOUT: 3`

这样可以避免第一次全量导入时卡在地点反查。等你确认同步稳定后，如果你确实想补全地点文本信息，再把 `DISABLE_REVERSE_GEOCODE` 改回 `false`。

### 页面站点信息

文件：

- `src/static/site-metadata.ts`

这里改：

- `siteTitle`
- `siteUrl`
- `logo`
- `description`
- `navLinks`

### 页面样式和地图

文件：

- `src/utils/const.ts`

常改的有：

- 地图供应商和样式
- 是否开启隐私模式
- 是否展示海拔爬升
- Google Analytics

## 4. 推荐的最小配置步骤

1. 把这个本地副本代码推送到 `https://github.com/imjasondai/running_page`
2. 在 GitHub 仓库里打开 `Settings -> Secrets and variables -> Actions`
3. 新增 `STRAVA_CLIENT_ID`
4. 新增 `STRAVA_CLIENT_SECRET`
5. 新增 `STRAVA_CLIENT_REFRESH_TOKEN`
6. 打开仓库的 `Actions` 页面
7. 手动运行一次 `Run Data Sync`
8. 等工作流把你的 Strava 数据写回仓库
9. 打开 `Settings -> Pages`，把 GitHub Pages 来源设为 `GitHub Actions`
10. 等 `Publish GitHub Pages` 工作流完成

如果前一步数据同步成功，网页就会用你的数据构建出来。

## 4.1 针对你这个仓库的 GitHub 页面操作

你需要重点确认这几项：

- `Actions` 已启用
- `Settings -> Pages -> Source` 选择 `GitHub Actions`
- 仓库默认分支是 `master`

这个 fork 当前默认分支如果保持 `master`，现有工作流可以直接使用，不需要额外改分支名。

## 5. 第一次同步后会生成什么

第一次成功后，主要会更新这些文件：

- `run_page/data.db`
- `src/static/activities.json`
- `assets/github.svg`
- `assets/grid.svg`
- `assets/year_summary.svg` 或按年份生成的统计图

现在我已经把 `src/static/activities.json` 清空了，所以在你真正完成第一次同步前，前端活动列表不会再直接展示上游作者的活动数据。

注意：

- `assets/` 目录里目前仍然保留了上游仓库自带的统计图文件，等你第一次跑完同步流程后会被你的数据重新生成覆盖
- 如果你不想把跑步原始轨迹公开，优先开启 `src/utils/const.ts` 里的隐私相关设置，并结合工作流里的 `IGNORE_*` 环境变量

## 6. 本地调试命令

在仓库根目录执行：

```bash
pip install -r requirements.txt
npm install -g corepack
corepack enable
pnpm install
python run_page/strava_sync.py 你的ClientID 你的ClientSecret 你的RefreshToken
python run_page/gen_svg.py --from-db --title "你的标题" --type github --output assets/github.svg
pnpm dev
```

如果你只想同步跑步，不同步骑行等类型：

```bash
python run_page/strava_sync.py 你的ClientID 你的ClientSecret 你的RefreshToken --only-run
```

## 7. 我建议你优先看的文件

- `run_page/strava_sync.py`
- `run_page/generator/__init__.py`
- `.github/workflows/run_data_sync.yml`
- `src/static/site-metadata.ts`
- `src/utils/const.ts`
