const l = [
  // name               sym  var  flags    zint  hri-label                  
  ["All", "*", "*", "     ", 0, "All"],
  ["AllReadable", "*", "r", "     ", 0, "All Readable"],
  ["AllCreatable", "*", "w", "     ", 0, "All Creatable"],
  ["AllLinear", "*", "l", "     ", 0, "All Linear"],
  ["AllMatrix", "*", "m", "     ", 0, "All Matrix"],
  ["AllGS1", "*", "G", "     ", 0, "All GS1"],
  ["AllRetail", "*", "R", "     ", 0, "All Retail"],
  ["AllIndustrial", "*", "I", "     ", 0, "All Industrial"],
  ["Codabar", "F", " ", "lrw  ", 18, "Codabar"],
  ["Code39", "A", " ", "lrw I", 8, "Code 39"],
  ["Code39Std", "A", "s", "lrw I", 8, "Code 39 Standard"],
  ["Code39Ext", "A", "e", "lr  I", 9, "Code 39 Extended"],
  ["Code32", "A", "2", "lr  I", 129, "Code 32"],
  ["PZN", "A", "p", "lr  I", 52, "Pharmazentralnummer"],
  ["Code93", "G", " ", "lrw I", 25, "Code 93"],
  ["Code128", "C", " ", "lrwGI", 20, "Code 128"],
  ["ITF", "I", " ", "lrw I", 3, "ITF"],
  ["ITF14", "I", "4", "lr  I", 89, "ITF-14"],
  ["DataBar", "e", " ", "lr GR", 29, "DataBar"],
  ["DataBarOmni", "e", "o", "lr GR", 29, "DataBar Omni"],
  ["DataBarStk", "e", "s", "lr GR", 79, "DataBar Stacked"],
  ["DataBarStkOmni", "e", "O", "lr GR", 80, "DataBar Stacked Omni"],
  ["DataBarLtd", "e", "l", "lr GR", 30, "DataBar Limited"],
  ["DataBarExp", "e", "e", "lr GR", 31, "DataBar Expanded"],
  ["DataBarExpStk", "e", "E", "lr GR", 81, "DataBar Expanded Stacked"],
  ["EANUPC", "E", " ", "lr  R", 15, "EAN/UPC"],
  ["EAN13", "E", "1", "lrw R", 15, "EAN-13"],
  ["EAN8", "E", "8", "lrw R", 10, "EAN-8"],
  ["EAN5", "E", "5", "l   R", 12, "EAN-5"],
  ["EAN2", "E", "2", "l   R", 11, "EAN-2"],
  ["ISBN", "E", "i", "lr  R", 69, "ISBN"],
  ["UPCA", "E", "a", "lrw R", 34, "UPC-A"],
  ["UPCE", "E", "e", "lrw R", 37, "UPC-E"],
  ["OtherBarcode", "X", " ", " r   ", 0, "Other barcode"],
  ["DXFilmEdge", "X", "x", "lr   ", 147, "DX Film Edge"],
  ["PDF417", "L", " ", "mrw  ", 55, "PDF417"],
  ["CompactPDF417", "L", "c", "mr   ", 56, "Compact PDF417"],
  ["MicroPDF417", "L", "m", "m    ", 84, "MicroPDF417"],
  ["Aztec", "z", " ", "mr G ", 92, "Aztec"],
  ["AztecCode", "z", "c", "mrwG ", 92, "Aztec Code"],
  ["AztecRune", "z", "r", "mr   ", 128, "Aztec Rune"],
  ["QRCode", "Q", " ", "mrwG ", 58, "QR Code"],
  ["QRCodeModel1", "Q", "1", "mr   ", 0, "QR Code Model 1"],
  ["QRCodeModel2", "Q", "2", "mr   ", 58, "QR Code Model 2"],
  ["MicroQRCode", "Q", "m", "mr   ", 97, "Micro QR Code"],
  ["RMQRCode", "Q", "r", "mr G ", 145, "rMQR Code"],
  ["DataMatrix", "d", " ", "mrwG ", 71, "Data Matrix"],
  ["MaxiCode", "U", " ", "mr   ", 57, "MaxiCode"]
], M = {
  /**
   * @deprecated Use `DataBarExp` instead.
   */
  DataBarExpanded: "DataBarExp",
  /**
   * @deprecated Use `DataBarLtd` instead.
   */
  DataBarLimited: "DataBarLtd",
  /**
   * @deprecated Use `AllLinear` instead.
   */
  "Linear-Codes": "AllLinear",
  /**
   * @deprecated Use `AllMatrix` instead.
   */
  "Matrix-Codes": "AllMatrix",
  /**
   * @deprecated Use `All` instead.
   */
  Any: "All",
  rMQRCode: "RMQRCode"
}, ne = l.map((e) => e[5]), G = l.filter((e) => e[1] === "*"), se = G.map(
  (e) => e[0]
), U = l.filter((e) => e[1] !== "*"), P = U.map((e) => e[0]), ie = P, z = l.filter((e) => e[2] === " "), le = z.map((e) => e[0]), Q = l.filter(
  (e) => e[3][0] === "l"
), H = Q.map(
  (e) => e[0]
), ce = H, v = l.filter(
  (e) => e[3][0] === "m"
), k = v.map(
  (e) => e[0]
), de = k, X = l.filter(
  (e) => e[3][1] === "r"
), Ae = X.map(
  (e) => e[0]
), Z = l.filter(
  (e) => e[3][2] === "w" || e[4] !== 0
), Re = Z.map(
  (e) => e[0]
), W = l.filter(
  (e) => e[3][3] === "G"
), Ee = W.map((e) => e[0]), j = l.filter(
  (e) => e[3][4] === "R"
), fe = j.map(
  (e) => e[0]
), $ = l.filter(
  (e) => e[3][4] === "I"
), me = $.map(
  (e) => e[0]
);
function Oe(e) {
  const t = [];
  let r;
  for (const a of l)
    if (a[1] !== "*")
      if (!r)
        a[0] === e && (t.push(a[0]), r = a[1]);
      else if (a[1] === r)
        t.push(a[0]);
      else
        break;
  return t;
}
function Ce(e) {
  let t;
  for (const r of l)
    if (r[1] !== "*" && (r[2] === " " && (t = r[0]), r[0] === e))
      return t;
}
function Ie(e) {
  var r;
  const t = (r = M[e]) != null ? r : e;
  for (const a of l)
    if (a[0] === t || a[5] === t)
      return a[5];
}
function D(e) {
  var t;
  return (t = M[e]) != null ? t : e;
}
function q(e) {
  return e.map(D).join(",");
}
const y = [
  "LocalAverage",
  "GlobalHistogram",
  "FixedThreshold",
  "BoolCast"
], Se = y;
function Y(e) {
  return y.indexOf(e);
}
const S = [
  "Unknown",
  "ASCII",
  "ISO8859_1",
  "ISO8859_2",
  "ISO8859_3",
  "ISO8859_4",
  "ISO8859_5",
  "ISO8859_6",
  "ISO8859_7",
  "ISO8859_8",
  "ISO8859_9",
  "ISO8859_10",
  "ISO8859_11",
  "ISO8859_13",
  "ISO8859_14",
  "ISO8859_15",
  "ISO8859_16",
  "Cp437",
  "Cp1250",
  "Cp1251",
  "Cp1252",
  "Cp1256",
  "Shift_JIS",
  "Big5",
  "GB2312",
  "GB18030",
  "EUC_JP",
  "EUC_KR",
  "UTF16BE",
  "UTF8",
  "UTF16LE",
  "UTF32BE",
  "UTF32LE",
  "BINARY"
], _e = S;
function V(e) {
  return e === "UnicodeBig" ? S.indexOf("UTF16BE") : S.indexOf(e);
}
const F = [
  "Text",
  "Binary",
  "Mixed",
  "GS1",
  "ISO15434",
  "UnknownECI"
], ue = F;
function J(e) {
  return F[e];
}
const p = ["Ignore", "Read", "Require"], Te = p;
function K(e) {
  return p.indexOf(e);
}
const w = [
  "Plain",
  "ECI",
  "HRI",
  "Escaped",
  "Hex",
  "HexECI"
], Be = w;
function ee(e) {
  return w.indexOf(e);
}
const m = {
  formats: [],
  tryHarder: !0,
  tryRotate: !0,
  tryInvert: !0,
  tryDownscale: !0,
  tryDenoise: !1,
  binarizer: "LocalAverage",
  isPure: !1,
  downscaleFactor: 3,
  downscaleThreshold: 500,
  minLineCount: 2,
  maxNumberOfSymbols: 255,
  validateOptionalChecksum: !1,
  returnErrors: !1,
  eanAddOnSymbol: "Ignore",
  textMode: "HRI",
  characterSet: "Unknown",
  tryCode39ExtendedMode: !0
};
function T(e) {
  var t;
  return {
    ...e,
    formats: q(e.formats),
    binarizer: Y(e.binarizer),
    eanAddOnSymbol: K(e.eanAddOnSymbol),
    textMode: ee(e.textMode),
    characterSet: V(e.characterSet),
    tryCode39ExtendedMode: (t = e.tryCode39ExtendedMode) != null ? t : !0
  };
}
function te(e) {
  return {
    ...e,
    format: e.format,
    symbology: e.symbology,
    contentType: J(e.contentType)
  };
}
function B(e) {
  var t;
  return {
    ...e,
    image: (t = e.image && new Blob([new Uint8Array(e.image)], {
      type: "image/png"
    })) != null ? t : null
  };
}
const i = {
  format: "QRCode",
  readerInit: !1,
  forceSquareDataMatrix: !1,
  ecLevel: "",
  scale: 1,
  sizeHint: 0,
  rotate: 0,
  invert: !1,
  withHRT: !1,
  withQuietZones: !0,
  addHRT: !1,
  addQuietZones: !0,
  options: ""
};
function re(e = i) {
  var _, u;
  const {
    format: t = i.format,
    sizeHint: r = i.sizeHint,
    readerInit: a = i.readerInit,
    forceSquareDataMatrix: o = i.forceSquareDataMatrix,
    ecLevel: c = i.ecLevel,
    withHRT: n,
    withQuietZones: A,
    addHRT: s,
    addQuietZones: d,
    options: O = i.options,
    scale: R,
    rotate: L = i.rotate,
    invert: b = i.invert
  } = e, C = O.split(",").map((E) => E.trim()).filter(Boolean), I = (E) => {
    const g = E.split("=")[0];
    C.some((N) => N.split("=")[0] === g) || C.push(E);
  };
  a && I("readerInit"), o && I("forceSquare"), c && I(`ecLevel=${c}`);
  const x = R != null ? R : r > 0 ? -Math.trunc(Math.abs(r)) : i.scale;
  return {
    format: D(t),
    options: C.join(","),
    scale: x,
    rotate: L,
    invert: b,
    addHRT: (_ = s != null ? s : n) != null ? _ : i.addHRT,
    addQuietZones: (u = d != null ? d : A) != null ? u : i.addQuietZones
  };
}
const Me = "3.0.0", De = "9a9ccb838fcbf067cc9a9f0fd26d06fe6cc02467", ae = {
  locateFile: (e, t) => {
    const r = e.match(/_(.+?)\.wasm$/);
    return r ? `https://fastly.jsdelivr.net/npm/zxing-wasm@3.0.0/dist/${r[1]}/${e}` : t + e;
  }
}, f = /* @__PURE__ */ new WeakMap();
function oe(e, t) {
  return Object.is(e, t) || Object.keys(e).length === Object.keys(t).length && Object.keys(e).every(
    (r) => Object.hasOwn(t, r) && e[r] === t[r]
  );
}
function h(e, {
  overrides: t,
  equalityFn: r = oe,
  fireImmediately: a = !1
} = {}) {
  var s;
  const [o, c] = (s = f.get(e)) != null ? s : [ae], n = t != null ? t : o;
  let A;
  if (a) {
    if (c && (A = r(o, n)))
      return c;
    const d = e({
      ...n
    });
    return f.set(e, [n, d]), d;
  }
  (A != null ? A : r(o, n)) || f.set(e, [n]);
}
function ye(e) {
  f.delete(e);
}
async function Fe(e, t, r = m) {
  const a = {
    ...m,
    ...r
  }, o = await h(e, {
    fireImmediately: !0
  });
  let c, n;
  if ("width" in t && "height" in t && "data" in t) {
    const {
      data: s,
      data: { byteLength: d },
      width: O,
      height: R
    } = t;
    n = o._malloc(d), o.HEAPU8.set(s, n), c = o.readBarcodesFromPixmap(
      n,
      O,
      R,
      T(a)
    );
  } else {
    let s, d;
    if ("buffer" in t)
      [s, d] = [t.byteLength, t];
    else if ("byteLength" in t)
      [s, d] = [t.byteLength, new Uint8Array(t)];
    else if ("size" in t)
      [s, d] = [t.size, new Uint8Array(await t.arrayBuffer())];
    else
      throw new TypeError("Invalid input type");
    n = o._malloc(s), o.HEAPU8.set(d, n), c = o.readBarcodesFromImage(
      n,
      s,
      T(a)
    );
  }
  o._free(n);
  const A = [];
  for (let s = 0; s < c.size(); ++s)
    A.push(
      te(c.get(s))
    );
  return A;
}
async function pe(e, t, r = i) {
  const a = re(r), o = await h(e, {
    fireImmediately: !0
  });
  if (typeof t == "string")
    return B(
      o.writeBarcodeFromText(t, a)
    );
  const { byteLength: c } = t, n = o._malloc(c);
  o.HEAPU8.set(t, n);
  const A = o.writeBarcodeFromBytes(
    n,
    c,
    a
  );
  return o._free(n), B(A);
}
const we = {
  ...m,
  formats: [...m.formats]
}, he = { ...i };
export {
  he as A,
  P as B,
  S as C,
  p as E,
  Ee as G,
  me as I,
  H as L,
  k as M,
  Ae as R,
  w as T,
  De as Z,
  ye as a,
  Me as b,
  ne as c,
  we as d,
  se as e,
  le as f,
  y as g,
  ie as h,
  Se as i,
  F as j,
  Re as k,
  _e as l,
  ue as m,
  Te as n,
  D as o,
  h as p,
  q,
  Fe as r,
  Ie as s,
  Ce as t,
  ce as u,
  de as v,
  fe as w,
  Oe as x,
  Be as y,
  pe as z
};
