## scalable

> scalable，Avoid the Rem, adaptation scheme of decimal details deviation defects such as Vw, make it easy for PC to develop more seamless switch to the mobile Web development。

## Theory

### Device & Viewport

- no fixed phone device screen size
- fixed viewport width by design width
- scale viewport by device width

### detail processing

todo

## Usage

### import

- npm

`npm i scalable-adapter --save`

- cdn

`<script src="***.cdn/scalable-adapter/index.js"></script>`

### Use

```
// 以375设计稿适配
window.Adapter.setAdapterDesign({
    width: 375
});
```

## ChangeLog

- ### 1.0.0 第一版