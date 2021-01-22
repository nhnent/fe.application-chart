# ![Toast UI Chart](https://user-images.githubusercontent.com/35218826/37320160-c4d6dec4-26b5-11e8-9a91-79bb2b882410.png)

> 🍞📈 Spread your data on TOAST UI Chart. TOAST UI Chart is Beautiful Statistical Data Visualization library.

[![GitHub release](https://img.shields.io/github/release/nhn/tui.chart.svg)](https://github.com/nhn/tui.chart/releases/latest) [![npm](https://img.shields.io/npm/v/tui-chart.svg)](https://www.npmjs.com/package/tui-chart) [![GitHub license](https://img.shields.io/github/license/nhn/tui.chart.svg)](https://github.com/nhn/tui.chart/blob/master/LICENSE) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/nhn/tui.chart/pulls) [![code with hearth by NHN](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-NHN-ff1414.svg)](https://github.com/nhn)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## 📦 Packages

The functionality of TOAST UI Chart is available when using the Plain JavaScript, React, Vue Component.

- [toast-ui.chart](https://github.com/nhn/tui.chart/tree/main/packages/chart) - Plain JavaScript component implemented by NHN.
- [toast-ui.vue-chart](https://github.com/nhn/tui.chart/tree/main/packages/vue-chart) - **Vue** wrapper component implemented by NHN.
- [toast-ui.react-chart](https://github.com/nhn/tui.chart/tree/main/packages/react-chart) - **React** wrapper component implemented by NHN.

## 📙 Documents

- [Getting Started](https://github.com/nhn/tui.chart/blob/main/docs/en/getting-started.md)
- Tutorials
  - [English](https://github.com/nhn/tui.chart/blob/next/docs/README.md)
  - [한국어](https://github.com/nhn/tui.chart/blob/next/docs/ko/README.md)
- [APIs](https://nhn.github.io/tui.chart/latest/)
- v4.0 Migration Guide 
  - [English](https://github.com/nhn/tui.chart/blob/next/docs/v4.0-migration-guide-en.md)
  - [한국어](https://github.com/nhn/tui.chart/blob/next/docs/v4.0-migration-guide-ko.md)


## 😍 Why TOAST UI Chart?

### Simple, Easy to Use, And It's Beautiful!

TOAST UI 차트는 당신의 데이터를 더 아름답고 이해하기 쉽게 보여줄 것이다. 또한, 당신의 서비스에 적합하도록 차트를 변경할 수 있게 다양한 테마 옵션을 제공하고 있다. 제목, 축, 범례, 툴팁, 플롯, 시리즈 등 차트의 많은 부분을 커스터 마이징할 수 있는 많은 옵션을 추가했다.

![image](https://user-images.githubusercontent.com/35371660/105487165-01af3500-5cf3-11eb-9243-c66de968798c.png)

### Variety of powerful features!

#### Responsive

**responsive** 옵션을 통해 차트의 크기 별로 다른 옵션과 애니메이션을 적용할 수 있다.

![image](https://user-images.githubusercontent.com/43128697/103401627-f9008e80-4b8c-11eb-8453-d64fe6830a9a.gif)

#### zoomable

**zoomable** 옵션을 통해 line, area, treemap 차트에서 데이터를 더 상세하게 확인할 수 있다.

`<gif>추가 필요`

#### live update

`addData` API와 `options.series.shift`옵션을 통해 실시간으로 추가되는 데이터를 파악할 수 있다.

![liveUpdate](https://user-images.githubusercontent.com/35371660/105494627-6ae87580-5cfe-11eb-846e-3c473bdace1f.gif)

#### Synchronize Tooltip

`showTooltip`API와 `on` 커스텀 이벤트를 통해 마우스가 차트에 올라가는 시점을 파악해 동기화된 툴팁 기능을 사용할 수 있다.

![synctooltip](https://user-images.githubusercontent.com/35371660/105493953-65d6f680-5cfd-11eb-9b51-204dbfd589c9.gif)

## 🎨 Features

### Charts

The TOAST UI Chart provides many types of charts to visualize the various forms of data.

| [Area](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-line.md)                                                                         | [Line](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-area.md)                                                                        | [Bar](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-bar.md)                                                                         | [Column](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-column.md)                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://user-images.githubusercontent.com/35371660/104139606-15ec5b80-53f0-11eb-96f6-c5bc593d9603.png"  width="300" alt='area chart'/> | <img src="https://user-images.githubusercontent.com/35371660/104139669-65328c00-53f0-11eb-9612-c457a0cdaf9f.png" width="300" alt='line chart'/> | <img src="https://user-images.githubusercontent.com/35371660/104140066-d2dfb780-53f2-11eb-8bba-355cb22bc35c.png" width="300" alt='bar chart'/> | <img src="https://user-images.githubusercontent.com/35371660/104139953-1259d400-53f2-11eb-8d48-2a48d4cfe6b2.png"  width="300" alt='column chart'/> |

| [Bullet](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-bullet.md)                                                                      | [BoxPlot](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-boxplot.md)                                                                     | [Treemap](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-treemap.md)                                                                     | [Heatmap](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-heatmap.md)                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://user-images.githubusercontent.com/35371660/104140183-76c96300-53f3-11eb-88c7-49c212d9e31b.png" width="300" alt='bullet chart'/> | <img src="https://user-images.githubusercontent.com/35371660/104140209-a6786b00-53f3-11eb-8ff0-ade619a89ff4.png" width="300" alt='boxplot chart'/> | <img src="https://user-images.githubusercontent.com/35371660/104140267-fd7e4000-53f3-11eb-878a-4eb24b4b83de.png" width="300" alt='treemap chart'/> | <img src="https://user-images.githubusercontent.com/35371660/104140300-243c7680-53f4-11eb-9c92-465355e34211.png" width="300" alt='heatmap chart'/> |

| [Scatter](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-scatter.md)                                                                     | [Bubble](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-bubble.md)                                                                      | [Radar](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-radar.md)                                                                       | [Pie](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-pie.md)                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://user-images.githubusercontent.com/35371660/104156462-6c778b00-542c-11eb-9101-a9df4e48d8db.png" width="300" alt='scatter chart'/> | <img src="https://user-images.githubusercontent.com/35371660/104156347-3508de80-542c-11eb-805e-fca276bc6c5f.png" width="300" alt='bubble chart'/> | <img src="https://user-images.githubusercontent.com/35371660/104140534-176c5280-53f5-11eb-830e-574b05fbf4db.png" width="300" alt='radar chart'/> | <img src="https://user-images.githubusercontent.com/35371660/104140544-2eab4000-53f5-11eb-87c3-d2bc9790fa5b.png" width="300" alt='pie chart'/> |

| [LineArea](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-lineArea.md)                                                                    | [LineScatter](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-lineScatter.md)                                                                 | [ColumnLine](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-columnLine.md)                                                                  | [NestedPie](https://github.com/nhn/tui.chart/blob/next/docs/en/chart-nestedPie.md)                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://user-images.githubusercontent.com/35371660/104140692-fc4e1280-53f5-11eb-8ae7-05568ed6f333.png" width="300" alt='lineArea chart'/> | <img src="https://user-images.githubusercontent.com/35371660/104156268-160a4c80-542c-11eb-9893-9adb052727da.png" width="300" alt='lineScatter chart'/> | <img src="https://user-images.githubusercontent.com/35371660/104140778-72527980-53f6-11eb-83ab-ad0883d8593b.png" width="300" alt='columnLine chart'/> | <img src="https://user-images.githubusercontent.com/35371660/104140795-8eeeb180-53f6-11eb-833e-ae1cdb9d8879.png" width="300" alt='nestedPie chart'/> |

- Stack Options(Explained in [each chart guide](https://github.com/nhn/tui.chart/tree/next/docs))
- Diverging Options(Explained in [each chart guide](https://github.com/nhn/tui.chart/tree/next/docs))
- Change Event Detect Type(Explained in [each chart guide](https://github.com/nhn/tui.chart/tree/next/docs))
- [Custom Theme](https://github.com/nhn/tui.chart/tree/next/docs)
- [Custom Tooltip](https://github.com/nhn/tui.chart/blob/next/docs/en/common-tooltip.md)
- [Export `xls`, `csv`, `png`, `jpeg` file](https://github.com/nhn/tui.chart/blob/next/docs/en/common-exportMenu.md)
- [Live Update](https://github.com/nhn/tui.chart/blob/next/docs/en/common-liveUpdate-options.md)
- [Responsive Layout](https://github.com/nhn/tui.chart/blob/next/docs/en/common-responsive-options.md)

In addition, a variety of powerful features can be found on the demo page below. 👇👇👇

## 🐾 Examples

- [Line Chart](http://nhn.github.io/tui.chart/latest/tutorial-example08-01-line-chart-basic)
- [Area Chart](http://nhn.github.io/tui.chart/latest/tutorial-example01-01-area-chart-basic)
- [LineArea Chart](http://nhn.github.io/tui.chart/latest/tutorial-example14-01-LineArea-chart-basic)
- [Bar Chart](http://nhn.github.io/tui.chart/latest/tutorial-example02-01-bar-chart-basic)
- [Column Chart](http://nhn.github.io/tui.chart/latest/tutorial-example06-01-column-chart-basic)
- [ColumnLine Chart](http://nhn.github.io/tui.chart/latest/tutorial-example13-01-columnLine-chart-basic)
- [Bullet Chart](http://nhn.github.io/tui.chart/latest/tutorial-example05-01-bullet-chart-baic)
- [BoxPlot Chart](http://nhn.github.io/tui.chart/latest/tutorial-example03-01-boxPlot-chart-basic)
- [Treemap Chart](http://nhn.github.io/tui.chart/latest/tutorial-example12-01-treemap-chart-basic)
- [Heatmap Chart](http://nhn.github.io/tui.chart/latest/tutorial-example07-01-heatmap-chart-basic)
- [Scatter Chart](http://nhn.github.io/tui.chart/latest/tutorial-example11-01-scatter-chart-basic)
- [LineScatter Chart](http://nhn.github.io/tui.chart/latest/tutorial-example15-01-LineScatter-chart-basic)
- [Bubble Chart](http://nhn.github.io/tui.chart/latest/tutorial-example04-01-bubble-chart-basic)
- [Pie Chart](http://nhn.github.io/tui.chart/latest/tutorial-example09-01-pie-chart-basic)
- [NestedPie Chart](http://nhn.github.io/tui.chart/latest/tutorial-example16-01-NestedPie-chart-basic)
- [Radar Chart](http://nhn.github.io/tui.chart/latest/tutorial-example10-01-radar-chart-basic)

Here are more [examples](http://nhn.github.io/tui.chart/latest/tutorial-example01-01-area-chart-basic) and play with TOAST UI Chart!

## 🔧 Pull Request Steps

TOAST UI products are open source, so you can create a pull request(PR) after you fix issues.
Run npm scripts and develop yourself with the following process.

### Setup

Fork `main` branch into your personal repository.
Clone it to local computer. Install node modules.
Before starting development, you should check to have any errors.

```sh
$ git clone https://github.com/{your-personal-repo}/tui.chart.git
$ npm install
$ cd apps/chart
$ npm install
$ npm run test
```

### Develop

Let's start development!
You can develop UI through webpack-dev-server or storybook, and you can write tests through Jest.
Don't miss adding test cases and then make green rights.

#### Run webpack-dev-server

```sh
$ npm run serve
```

#### Run storybook

```sh
$ npm run storybook
```

#### Run test

```sh
$ npm run test
```

### Pull Request

Before PR, check to test lastly and then check any errors.
If it has no error, commit and then push it!

For more information on PR's step, please see links of Contributing section.

## 💬 Contributing

- [Code of Conduct](https://github.com/nhn/tui.chart/blob/main/CODE_OF_CONDUCT.md)
- [Contributing guideline](https://github.com/nhn/tui.chart/blob/main/CONTRIBUTING.md)
- [Issue guideline](https://github.com/nhn/tui.chart/blob/main/docs/ISSUE_TEMPLATE.md)
- [Commit convention](https://github.com/nhn/tui.chart/blob/main/docs/COMMIT_MESSAGE_CONVENTION.md)

## 🌏 Browser Support

| <img src="https://user-images.githubusercontent.com/1215767/34348387-a2e64588-ea4d-11e7-8267-a43365103afe.png" alt="Chrome" width="16px" height="16px" /> Chrome | <img src="https://user-images.githubusercontent.com/1215767/34348590-250b3ca2-ea4f-11e7-9efb-da953359321f.png" alt="IE" width="16px" height="16px" /> Internet Explorer | <img src="https://user-images.githubusercontent.com/1215767/34348380-93e77ae8-ea4d-11e7-8696-9a989ddbbbf5.png" alt="Edge" width="16px" height="16px" /> Edge | <img src="https://user-images.githubusercontent.com/1215767/34348394-a981f892-ea4d-11e7-9156-d128d58386b9.png" alt="Safari" width="16px" height="16px" /> Safari | <img src="https://user-images.githubusercontent.com/1215767/34348383-9e7ed492-ea4d-11e7-910c-03b39d52f496.png" alt="Firefox" width="16px" height="16px" /> Firefox |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                               Yes                                                                                |                                                                                   10+                                                                                   |                                                                             Yes                                                                              |                                                                               Yes                                                                                |                                                                                Yes                                                                                 |

## 🍞 TOAST UI Family

- [TOAST UI Editor](https://github.com/nhn/tui.editor)
- [TOAST UI Grid](https://github.com/nhn/tui.grid)
- [TOAST UI Calendar](https://github.com/nhn/tui.calendar)
- [TOAST UI Image-Editor](https://github.com/nhn/tui.image-editor)
- [TOAST UI Components](https://github.com/nhn)

## 🚀 Used By

- [TOAST Cloud - Total Cloud Service](https://www.toast.com/service/)
- [NHN - ToastCam](https://cam.toast.com/ko/#/)
- [TOAST Dooray! - Collaboration Service (Project, Messenger, Mail, Calendar, Drive, Wiki, Contacts)](https://dooray.com)
- [NHN - Smart Downloader](https://docs.toast.com/ko/Game/Smart%20Downloader/ko/console-guide/)
- [NHN - Gamebase](https://docs.toast.com/ko/Game/Gamebase/ko/oper-analytics/)
- [NHN Edu - iamTeacher](https://teacher.iamservice.net)
- [HANGAME](https://www.hangame.com/)
- [Payco](https://www.payco.com/)

## 📜 License

This software is licensed under the [MIT](https://github.com/nhn/tui.chart/blob/main/LICENSE) © [NHN](https://github.com/nhn).
