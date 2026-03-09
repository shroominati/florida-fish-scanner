var je = (a) => {
  throw TypeError(a);
};
var Le = (a, l, h) => l.has(a) || je("Cannot " + h);
var Ue = (a, l, h) => (Le(a, l, "read from private field"), h ? h.call(a) : l.get(a)), ke = (a, l, h) => l.has(a) ? je("Cannot add the same private member more than once") : l instanceof WeakSet ? l.add(a) : l.set(a, h), We = (a, l, h, b) => (Le(a, l, "write to private field"), b ? b.call(a, h) : l.set(a, h), h);
const L = [
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
], Da = {
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
};
L.map((a) => a[5]);
const Ia = L.filter((a) => a[1] === "*");
Ia.map(
  (a) => a[0]
);
const Sa = L.filter((a) => a[1] !== "*");
Sa.map((a) => a[0]);
const Ra = L.filter((a) => a[2] === " ");
Ra.map((a) => a[0]);
const Ma = L.filter(
  (a) => a[3][0] === "l"
);
Ma.map(
  (a) => a[0]
);
const Fa = L.filter(
  (a) => a[3][0] === "m"
);
Fa.map(
  (a) => a[0]
);
const Ba = L.filter(
  (a) => a[3][1] === "r"
);
Ba.map(
  (a) => a[0]
);
const ja = L.filter(
  (a) => a[3][2] === "w" || a[4] !== 0
);
ja.map(
  (a) => a[0]
);
const La = L.filter(
  (a) => a[3][3] === "G"
);
La.map((a) => a[0]);
const Ua = L.filter(
  (a) => a[3][4] === "R"
);
Ua.map(
  (a) => a[0]
);
const ka = L.filter(
  (a) => a[3][4] === "I"
);
ka.map(
  (a) => a[0]
);
function Wa(a) {
  var l;
  return (l = Da[a]) != null ? l : a;
}
function Va(a) {
  return a.map(Wa).join(",");
}
const Ga = [
  "LocalAverage",
  "GlobalHistogram",
  "FixedThreshold",
  "BoolCast"
];
function Ha(a) {
  return Ga.indexOf(a);
}
const Ve = [
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
];
function za(a) {
  return a === "UnicodeBig" ? Ve.indexOf("UTF16BE") : Ve.indexOf(a);
}
const Na = [
  "Text",
  "Binary",
  "Mixed",
  "GS1",
  "ISO15434",
  "UnknownECI"
];
function Qa(a) {
  return Na[a];
}
const Xa = ["Ignore", "Read", "Require"];
function qa(a) {
  return Xa.indexOf(a);
}
const Ya = [
  "Plain",
  "ECI",
  "HRI",
  "Escaped",
  "Hex",
  "HexECI"
];
function Za(a) {
  return Ya.indexOf(a);
}
const It = {
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
function Ge(a) {
  var l;
  return {
    ...a,
    formats: Va(a.formats),
    binarizer: Ha(a.binarizer),
    eanAddOnSymbol: qa(a.eanAddOnSymbol),
    textMode: Za(a.textMode),
    characterSet: za(a.characterSet),
    tryCode39ExtendedMode: (l = a.tryCode39ExtendedMode) != null ? l : !0
  };
}
function Ja(a) {
  return {
    ...a,
    format: a.format,
    symbology: a.symbology,
    contentType: Qa(a.contentType)
  };
}
const $o = "3.0.0", To = "9a9ccb838fcbf067cc9a9f0fd26d06fe6cc02467", Ka = {
  locateFile: (a, l) => {
    const h = a.match(/_(.+?)\.wasm$/);
    return h ? `https://fastly.jsdelivr.net/npm/zxing-wasm@3.0.0/dist/${h[1]}/${a}` : l + a;
  }
}, Dt = /* @__PURE__ */ new WeakMap();
function to(a, l) {
  return Object.is(a, l) || Object.keys(a).length === Object.keys(l).length && Object.keys(a).every(
    (h) => Object.hasOwn(l, h) && a[h] === l[h]
  );
}
function ze(a, {
  overrides: l,
  equalityFn: h = to,
  fireImmediately: b = !1
} = {}) {
  var d;
  const [D, I] = (d = Dt.get(a)) != null ? d : [Ka], S = l != null ? l : D;
  let x;
  if (b) {
    if (I && (x = h(D, S)))
      return I;
    const R = a({
      ...S
    });
    return Dt.set(a, [S, R]), R;
  }
  (x != null ? x : h(D, S)) || Dt.set(a, [S]);
}
function eo(a) {
  Dt.delete(a);
}
async function ro(a, l, h = It) {
  const b = {
    ...It,
    ...h
  }, d = await ze(a, {
    fireImmediately: !0
  });
  let D, I;
  if ("width" in l && "height" in l && "data" in l) {
    const {
      data: x,
      data: { byteLength: R },
      width: W,
      height: X
    } = l;
    I = d._malloc(R), d.HEAPU8.set(x, I), D = d.readBarcodesFromPixmap(
      I,
      W,
      X,
      Ge(b)
    );
  } else {
    let x, R;
    if ("buffer" in l)
      [x, R] = [l.byteLength, l];
    else if ("byteLength" in l)
      [x, R] = [l.byteLength, new Uint8Array(l)];
    else if ("size" in l)
      [x, R] = [l.size, new Uint8Array(await l.arrayBuffer())];
    else
      throw new TypeError("Invalid input type");
    I = d._malloc(x), d.HEAPU8.set(R, I), D = d.readBarcodesFromImage(
      I,
      x,
      Ge(b)
    );
  }
  d._free(I);
  const S = [];
  for (let x = 0; x < D.size(); ++x)
    S.push(
      Ja(D.get(x))
    );
  return S;
}
({
  ...It,
  formats: [...It.formats]
});
async function Xt(a = {}) {
  var l, h, b, d = a, D = !!globalThis.window, I = typeof Bun < "u", S = !!globalThis.WorkerGlobalScope;
  !((h = globalThis.process) === null || h === void 0 || (h = h.versions) === null || h === void 0) && h.node && ((b = globalThis.process) === null || b === void 0 ? void 0 : b.type) != "renderer";
  var x = "./this.program", R, W = "";
  function X(t) {
    return d.locateFile ? d.locateFile(t, W) : W + t;
  }
  var et, q;
  if (D || S || I) {
    try {
      W = new URL(".", R).href;
    } catch {
    }
    S && (q = (t) => {
      var e = new XMLHttpRequest();
      return e.open("GET", t, !1), e.responseType = "arraybuffer", e.send(null), new Uint8Array(e.response);
    }), et = async (t) => {
      var e = await fetch(t, {
        credentials: "same-origin"
      });
      if (e.ok)
        return e.arrayBuffer();
      throw new Error(e.status + " : " + e.url);
    };
  }
  var at = console.log.bind(console), V = console.error.bind(console), Y, ht = !1, qt, Yt, Z, G, pt, ot, it, A, Zt, Jt, Kt = !1;
  function te() {
    var t = At.buffer;
    Z = new Int8Array(t), pt = new Int16Array(t), d.HEAPU8 = G = new Uint8Array(t), ot = new Uint16Array(t), it = new Int32Array(t), A = new Uint32Array(t), Zt = new Float32Array(t), Jt = new Float64Array(t);
  }
  function rr() {
    if (d.preRun)
      for (typeof d.preRun == "function" && (d.preRun = [d.preRun]); d.preRun.length; )
        hr(d.preRun.shift());
    ee(ne);
  }
  function nr() {
    Kt = !0, dt.xa();
  }
  function ar() {
    if (d.postRun)
      for (typeof d.postRun == "function" && (d.postRun = [d.postRun]); d.postRun.length; )
        fr(d.postRun.shift());
    ee(re);
  }
  function St(t) {
    var e, r;
    (e = d.onAbort) === null || e === void 0 || e.call(d, t), t = "Aborted(" + t + ")", V(t), ht = !0, t += ". Build with -sASSERTIONS for more info.";
    var n = new WebAssembly.RuntimeError(t);
    throw (r = Yt) === null || r === void 0 || r(n), n;
  }
  var mt;
  function or() {
    return X("zxing_reader.wasm");
  }
  function ir(t) {
    if (t == mt && Y)
      return new Uint8Array(Y);
    if (q)
      return q(t);
    throw "both async and sync fetching of the wasm failed";
  }
  async function sr(t) {
    if (!Y)
      try {
        var e = await et(t);
        return new Uint8Array(e);
      } catch {
      }
    return ir(t);
  }
  async function ur(t, e) {
    try {
      var r = await sr(t), n = await WebAssembly.instantiate(r, e);
      return n;
    } catch (o) {
      V(`failed to asynchronously prepare wasm: ${o}`), St(o);
    }
  }
  async function cr(t, e, r) {
    if (!t && WebAssembly.instantiateStreaming)
      try {
        var n = fetch(e, {
          credentials: "same-origin"
        }), o = await WebAssembly.instantiateStreaming(n, r);
        return o;
      } catch (i) {
        V(`wasm streaming compile failed: ${i}`), V("falling back to ArrayBuffer instantiation");
      }
    return ur(e, r);
  }
  function lr() {
    var t = {
      a: Nn
    };
    return t;
  }
  async function dr() {
    function t(i, s) {
      return dt = i.exports, zn(dt), te(), dt;
    }
    function e(i) {
      return t(i.instance);
    }
    var r = lr();
    if (d.instantiateWasm)
      return new Promise((i, s) => {
        d.instantiateWasm(r, (u, c) => {
          i(t(u));
        });
      });
    mt != null || (mt = or());
    var n = await cr(Y, mt, r), o = e(n);
    return o;
  }
  var ee = (t) => {
    for (; t.length > 0; )
      t.shift()(d);
  }, re = [], fr = (t) => re.push(t), ne = [], hr = (t) => ne.push(t), v = (t) => _e(t), g = () => Ae(), yt = [], vt = 0, pr = (t) => {
    var e = new Rt(t);
    return e.get_caught() || (e.set_caught(!0), vt--), e.set_rethrown(!1), yt.push(e), Oe(t), Te(t);
  }, H = 0, mr = () => {
    y(0, 0);
    var t = yt.pop();
    Pe(t.excPtr), H = 0;
  };
  class Rt {
    constructor(e) {
      this.excPtr = e, this.ptr = e - 24;
    }
    set_type(e) {
      A[this.ptr + 4 >> 2] = e;
    }
    get_type() {
      return A[this.ptr + 4 >> 2];
    }
    set_destructor(e) {
      A[this.ptr + 8 >> 2] = e;
    }
    get_destructor() {
      return A[this.ptr + 8 >> 2];
    }
    set_caught(e) {
      e = e ? 1 : 0, Z[this.ptr + 12] = e;
    }
    get_caught() {
      return Z[this.ptr + 12] != 0;
    }
    set_rethrown(e) {
      e = e ? 1 : 0, Z[this.ptr + 13] = e;
    }
    get_rethrown() {
      return Z[this.ptr + 13] != 0;
    }
    init(e, r) {
      this.set_adjusted_ptr(0), this.set_type(e), this.set_destructor(r);
    }
    set_adjusted_ptr(e) {
      A[this.ptr + 16 >> 2] = e;
    }
    get_adjusted_ptr() {
      return A[this.ptr + 16 >> 2];
    }
  }
  var gt = (t) => Ee(t), Mt = (t) => {
    var e = H;
    if (!e)
      return gt(0), 0;
    var r = new Rt(e);
    r.set_adjusted_ptr(e);
    var n = r.get_type();
    if (!n)
      return gt(0), e;
    for (var o of t) {
      if (o === 0 || o === n)
        break;
      var i = r.ptr + 16;
      if (xe(o, n, i))
        return gt(o), e;
    }
    return gt(n), e;
  }, yr = () => Mt([]), vr = (t) => Mt([t]), gr = (t, e) => Mt([t, e]), wr = () => {
    var t = yt.pop();
    t || St("no exception to throw");
    var e = t.excPtr;
    throw t.get_rethrown() || (yt.push(t), t.set_rethrown(!0), t.set_caught(!1), vt++), H = e, H;
  }, br = (t, e, r) => {
    var n = new Rt(t);
    throw n.init(e, r), H = t, vt++, H;
  }, Cr = () => vt, $r = (t) => {
    throw H || (H = t), H;
  }, Tr = () => St(""), wt = {}, Ft = (t) => {
    for (; t.length; ) {
      var e = t.pop(), r = t.pop();
      r(e);
    }
  };
  function st(t) {
    return this.fromWireType(A[t >> 2]);
  }
  var rt = {}, J = {}, bt = {}, Er = class extends Error {
    constructor(t) {
      super(t), this.name = "InternalError";
    }
  }, Ct = (t) => {
    throw new Er(t);
  }, K = (t, e, r) => {
    t.forEach((u) => bt[u] = e);
    function n(u) {
      var c = r(u);
      c.length !== t.length && Ct("Mismatched type converter count");
      for (var f = 0; f < t.length; ++f)
        U(t[f], c[f]);
    }
    var o = new Array(e.length), i = [], s = 0;
    {
      const u = e;
      for (let c = 0; c < u.length; ++c) {
        const f = u[c];
        J.hasOwnProperty(f) ? o[c] = J[f] : (i.push(f), rt.hasOwnProperty(f) || (rt[f] = []), rt[f].push(() => {
          o[c] = J[f], ++s, s === i.length && n(o);
        }));
      }
    }
    i.length === 0 && n(o);
  }, _r = (t) => {
    var e = wt[t];
    delete wt[t];
    var r = e.rawConstructor, n = e.rawDestructor, o = e.fields, i = o.map((s) => s.getterReturnType).concat(o.map((s) => s.setterArgumentType));
    K([t], i, (s) => {
      var u = {};
      {
        const c = o;
        for (let f = 0; f < c.length; ++f) {
          const p = c[f], m = s[f], $ = p.getter, E = p.getterContext, O = s[f + o.length], P = p.setter, _ = p.setterContext;
          u[p.fieldName] = {
            read: (T) => m.fromWireType($(E, T)),
            write: (T, j) => {
              var F = [];
              P(_, T, O.toWireType(F, j)), Ft(F);
            },
            optional: m.optional
          };
        }
      }
      return [{
        name: e.name,
        fromWireType: (c) => {
          var f = {};
          for (var p in u)
            f[p] = u[p].read(c);
          return n(c), f;
        },
        toWireType: (c, f) => {
          for (var p in u)
            if (!(p in f) && !u[p].optional)
              throw new TypeError(`Missing field: "${p}"`);
          var m = r();
          for (p in u)
            u[p].write(m, f[p]);
          return c !== null && c.push(n, m), m;
        },
        readValueFromPointer: st,
        destructorFunction: n
      }];
    });
  }, Ar = (t, e, r, n, o) => {
  }, M = (t) => {
    for (var e = ""; ; ) {
      var r = G[t++];
      if (!r) return e;
      e += String.fromCharCode(r);
    }
  }, ut = class extends Error {
    constructor(t) {
      super(t), this.name = "BindingError";
    }
  }, C = (t) => {
    throw new ut(t);
  };
  function Pr(t, e) {
    let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var n = e.name;
    if (t || C(`type "${n}" must have a positive integer typeid pointer`), J.hasOwnProperty(t)) {
      if (r.ignoreDuplicateRegistrations)
        return;
      C(`Cannot register type '${n}' twice`);
    }
    if (J[t] = e, delete bt[t], rt.hasOwnProperty(t)) {
      var o = rt[t];
      delete rt[t], o.forEach((i) => i());
    }
  }
  function U(t, e) {
    let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return Pr(t, e, r);
  }
  var Or = (t, e, r, n) => {
    e = M(e), U(t, {
      name: e,
      fromWireType: function(o) {
        return !!o;
      },
      toWireType: function(o, i) {
        return i ? r : n;
      },
      readValueFromPointer: function(o) {
        return this.fromWireType(G[o]);
      },
      destructorFunction: null
    });
  }, xr = (t) => ({
    count: t.count,
    deleteScheduled: t.deleteScheduled,
    preservePointerOnDelete: t.preservePointerOnDelete,
    ptr: t.ptr,
    ptrType: t.ptrType,
    smartPtr: t.smartPtr,
    smartPtrType: t.smartPtrType
  }), Bt = (t) => {
    function e(r) {
      return r.$$.ptrType.registeredClass.name;
    }
    C(e(t) + " instance already deleted");
  }, jt = !1, ae = (t) => {
  }, Dr = (t) => {
    t.smartPtr ? t.smartPtrType.rawDestructor(t.smartPtr) : t.ptrType.registeredClass.rawDestructor(t.ptr);
  }, oe = (t) => {
    t.count.value -= 1;
    var e = t.count.value === 0;
    e && Dr(t);
  }, ct = (t) => globalThis.FinalizationRegistry ? (jt = new FinalizationRegistry((e) => {
    oe(e.$$);
  }), ct = (e) => {
    var r = e.$$, n = !!r.smartPtr;
    if (n) {
      var o = {
        $$: r
      };
      jt.register(e, o, e);
    }
    return e;
  }, ae = (e) => jt.unregister(e), ct(t)) : (ct = (e) => e, t), Ir = () => {
    let t = $t.prototype;
    Object.assign(t, {
      isAliasOf(r) {
        if (!(this instanceof $t) || !(r instanceof $t))
          return !1;
        var n = this.$$.ptrType.registeredClass, o = this.$$.ptr;
        r.$$ = r.$$;
        for (var i = r.$$.ptrType.registeredClass, s = r.$$.ptr; n.baseClass; )
          o = n.upcast(o), n = n.baseClass;
        for (; i.baseClass; )
          s = i.upcast(s), i = i.baseClass;
        return n === i && o === s;
      },
      clone() {
        if (this.$$.ptr || Bt(this), this.$$.preservePointerOnDelete)
          return this.$$.count.value += 1, this;
        var r = ct(Object.create(Object.getPrototypeOf(this), {
          $$: {
            value: xr(this.$$)
          }
        }));
        return r.$$.count.value += 1, r.$$.deleteScheduled = !1, r;
      },
      delete() {
        this.$$.ptr || Bt(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && C("Object already scheduled for deletion"), ae(this), oe(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
      },
      isDeleted() {
        return !this.$$.ptr;
      },
      deleteLater() {
        return this.$$.ptr || Bt(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && C("Object already scheduled for deletion"), this.$$.deleteScheduled = !0, this;
      }
    });
    const e = Symbol.dispose;
    e && (t[e] = t.delete);
  };
  function $t() {
  }
  var Lt = (t, e) => Object.defineProperty(e, "name", {
    value: t
  }), ie = {}, se = (t, e, r) => {
    if (t[e].overloadTable === void 0) {
      var n = t[e];
      t[e] = function() {
        for (var o = arguments.length, i = new Array(o), s = 0; s < o; s++)
          i[s] = arguments[s];
        return t[e].overloadTable.hasOwnProperty(i.length) || C(`Function '${r}' called with an invalid number of arguments (${i.length}) - expects one of (${t[e].overloadTable})!`), t[e].overloadTable[i.length].apply(this, i);
      }, t[e].overloadTable = [], t[e].overloadTable[n.argCount] = n;
    }
  }, ue = (t, e, r) => {
    d.hasOwnProperty(t) ? ((r === void 0 || d[t].overloadTable !== void 0 && d[t].overloadTable[r] !== void 0) && C(`Cannot register public name '${t}' twice`), se(d, t, t), d[t].overloadTable.hasOwnProperty(r) && C(`Cannot register multiple overloads of a function with the same number of arguments (${r})!`), d[t].overloadTable[r] = e) : (d[t] = e, d[t].argCount = r);
  }, Sr = 48, Rr = 57, Mr = (t) => {
    t = t.replace(/[^a-zA-Z0-9_]/g, "$");
    var e = t.charCodeAt(0);
    return e >= Sr && e <= Rr ? `_${t}` : t;
  };
  function Fr(t, e, r, n, o, i, s, u) {
    this.name = t, this.constructor = e, this.instancePrototype = r, this.rawDestructor = n, this.baseClass = o, this.getActualType = i, this.upcast = s, this.downcast = u, this.pureVirtualFunctions = [];
  }
  var Ut = (t, e, r) => {
    for (; e !== r; )
      e.upcast || C(`Expected null or instance of ${r.name}, got an instance of ${e.name}`), t = e.upcast(t), e = e.baseClass;
    return t;
  }, kt = (t) => {
    if (t === null)
      return "null";
    var e = typeof t;
    return e === "object" || e === "array" || e === "function" ? t.toString() : "" + t;
  };
  function Br(t, e) {
    if (e === null)
      return this.isReference && C(`null is not a valid ${this.name}`), 0;
    e.$$ || C(`Cannot pass "${kt(e)}" as a ${this.name}`), e.$$.ptr || C(`Cannot pass deleted object as a pointer of type ${this.name}`);
    var r = e.$$.ptrType.registeredClass, n = Ut(e.$$.ptr, r, this.registeredClass);
    return n;
  }
  function jr(t, e) {
    var r;
    if (e === null)
      return this.isReference && C(`null is not a valid ${this.name}`), this.isSmartPointer ? (r = this.rawConstructor(), t !== null && t.push(this.rawDestructor, r), r) : 0;
    (!e || !e.$$) && C(`Cannot pass "${kt(e)}" as a ${this.name}`), e.$$.ptr || C(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && e.$$.ptrType.isConst && C(`Cannot convert argument of type ${e.$$.smartPtrType ? e.$$.smartPtrType.name : e.$$.ptrType.name} to parameter type ${this.name}`);
    var n = e.$$.ptrType.registeredClass;
    if (r = Ut(e.$$.ptr, n, this.registeredClass), this.isSmartPointer)
      switch (e.$$.smartPtr === void 0 && C("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
        case 0:
          e.$$.smartPtrType === this ? r = e.$$.smartPtr : C(`Cannot convert argument of type ${e.$$.smartPtrType ? e.$$.smartPtrType.name : e.$$.ptrType.name} to parameter type ${this.name}`);
          break;
        case 1:
          r = e.$$.smartPtr;
          break;
        case 2:
          if (e.$$.smartPtrType === this)
            r = e.$$.smartPtr;
          else {
            var o = e.clone();
            r = this.rawShare(r, k.toHandle(() => o.delete())), t !== null && t.push(this.rawDestructor, r);
          }
          break;
        default:
          C("Unsupporting sharing policy");
      }
    return r;
  }
  function Lr(t, e) {
    if (e === null)
      return this.isReference && C(`null is not a valid ${this.name}`), 0;
    e.$$ || C(`Cannot pass "${kt(e)}" as a ${this.name}`), e.$$.ptr || C(`Cannot pass deleted object as a pointer of type ${this.name}`), e.$$.ptrType.isConst && C(`Cannot convert argument of type ${e.$$.ptrType.name} to parameter type ${this.name}`);
    var r = e.$$.ptrType.registeredClass, n = Ut(e.$$.ptr, r, this.registeredClass);
    return n;
  }
  var ce = (t, e, r) => {
    if (e === r)
      return t;
    if (r.baseClass === void 0)
      return null;
    var n = ce(t, e, r.baseClass);
    return n === null ? null : r.downcast(n);
  }, Ur = {}, kr = (t, e) => {
    for (e === void 0 && C("ptr should not be undefined"); t.baseClass; )
      e = t.upcast(e), t = t.baseClass;
    return e;
  }, Wr = (t, e) => (e = kr(t, e), Ur[e]), Tt = (t, e) => {
    (!e.ptrType || !e.ptr) && Ct("makeClassHandle requires ptr and ptrType");
    var r = !!e.smartPtrType, n = !!e.smartPtr;
    return r !== n && Ct("Both smartPtrType and smartPtr must be specified"), e.count = {
      value: 1
    }, ct(Object.create(t, {
      $$: {
        value: e,
        writable: !0
      }
    }));
  };
  function Vr(t) {
    var e = this.getPointee(t);
    if (!e)
      return this.destructor(t), null;
    var r = Wr(this.registeredClass, e);
    if (r !== void 0) {
      if (r.$$.count.value === 0)
        return r.$$.ptr = e, r.$$.smartPtr = t, r.clone();
      var n = r.clone();
      return this.destructor(t), n;
    }
    function o() {
      return this.isSmartPointer ? Tt(this.registeredClass.instancePrototype, {
        ptrType: this.pointeeType,
        ptr: e,
        smartPtrType: this,
        smartPtr: t
      }) : Tt(this.registeredClass.instancePrototype, {
        ptrType: this,
        ptr: t
      });
    }
    var i = this.registeredClass.getActualType(e), s = ie[i];
    if (!s)
      return o.call(this);
    var u;
    this.isConst ? u = s.constPointerType : u = s.pointerType;
    var c = ce(e, this.registeredClass, u.registeredClass);
    return c === null ? o.call(this) : this.isSmartPointer ? Tt(u.registeredClass.instancePrototype, {
      ptrType: u,
      ptr: c,
      smartPtrType: this,
      smartPtr: t
    }) : Tt(u.registeredClass.instancePrototype, {
      ptrType: u,
      ptr: c
    });
  }
  var Gr = () => {
    Object.assign(Et.prototype, {
      getPointee(t) {
        return this.rawGetPointee && (t = this.rawGetPointee(t)), t;
      },
      destructor(t) {
        var e;
        (e = this.rawDestructor) === null || e === void 0 || e.call(this, t);
      },
      readValueFromPointer: st,
      fromWireType: Vr
    });
  };
  function Et(t, e, r, n, o, i, s, u, c, f, p) {
    this.name = t, this.registeredClass = e, this.isReference = r, this.isConst = n, this.isSmartPointer = o, this.pointeeType = i, this.sharingPolicy = s, this.rawGetPointee = u, this.rawConstructor = c, this.rawShare = f, this.rawDestructor = p, !o && e.baseClass === void 0 ? n ? (this.toWireType = Br, this.destructorFunction = null) : (this.toWireType = Lr, this.destructorFunction = null) : this.toWireType = jr;
  }
  var le = (t, e, r) => {
    d.hasOwnProperty(t) || Ct("Replacing nonexistent public symbol"), d[t].overloadTable !== void 0 && r !== void 0 ? d[t].overloadTable[r] = e : (d[t] = e, d[t].argCount = r);
  }, N = {}, Hr = (t, e, r) => {
    t = t.replace(/p/g, "i");
    var n = N[t];
    return n(e, ...r);
  }, de = [], w = (t) => {
    var e = de[t];
    return e || (de[t] = e = Se.get(t)), e;
  }, zr = function(t, e) {
    let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    if (t.includes("j"))
      return Hr(t, e, r);
    var n = w(e), o = n(...r);
    return o;
  }, Nr = function(t, e) {
    let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    return function() {
      for (var n = arguments.length, o = new Array(n), i = 0; i < n; i++)
        o[i] = arguments[i];
      return zr(t, e, o, r);
    };
  }, B = function(t, e) {
    t = M(t);
    function r() {
      if (t.includes("j"))
        return Nr(t, e);
      var o = w(e);
      return o;
    }
    var n = r();
    return typeof n != "function" && C(`unknown function pointer with signature ${t}: ${e}`), n;
  };
  class Qr extends Error {
  }
  var fe = (t) => {
    var e = $e(t), r = M(e);
    return Q(e), r;
  }, _t = (t, e) => {
    var r = [], n = {};
    function o(i) {
      if (!n[i] && !J[i]) {
        if (bt[i]) {
          bt[i].forEach(o);
          return;
        }
        r.push(i), n[i] = !0;
      }
    }
    throw e.forEach(o), new Qr(`${t}: ` + r.map(fe).join([", "]));
  }, Xr = (t, e, r, n, o, i, s, u, c, f, p, m, $) => {
    p = M(p), i = B(o, i), u && (u = B(s, u)), f && (f = B(c, f)), $ = B(m, $);
    var E = Mr(p);
    ue(E, function() {
      _t(`Cannot construct ${p} due to unbound types`, [n]);
    }), K([t, e, r], n ? [n] : [], (O) => {
      O = O[0];
      var P, _;
      n ? (P = O.registeredClass, _ = P.instancePrototype) : _ = $t.prototype;
      var T = Lt(p, function() {
        if (Object.getPrototypeOf(this) !== j)
          throw new ut(`Use 'new' to construct ${p}`);
        if (F.constructor_body === void 0)
          throw new ut(`${p} has no accessible constructor`);
        for (var Fe = arguments.length, Ot = new Array(Fe), xt = 0; xt < Fe; xt++)
          Ot[xt] = arguments[xt];
        var Be = F.constructor_body[Ot.length];
        if (Be === void 0)
          throw new ut(`Tried to invoke ctor of ${p} with invalid number of parameters (${Ot.length}) - expected (${Object.keys(F.constructor_body).toString()}) parameters instead!`);
        return Be.apply(this, Ot);
      }), j = Object.create(_, {
        constructor: {
          value: T
        }
      });
      T.prototype = j;
      var F = new Fr(p, T, j, $, P, i, u, f);
      if (F.baseClass) {
        var z, Pt;
        (Pt = (z = F.baseClass).__derivedClasses) !== null && Pt !== void 0 || (z.__derivedClasses = []), F.baseClass.__derivedClasses.push(F);
      }
      var xa = new Et(p, F, !0, !1, !1), Re = new Et(p + "*", F, !1, !1, !1), Me = new Et(p + " const*", F, !1, !0, !1);
      return ie[t] = {
        pointerType: Re,
        constPointerType: Me
      }, le(E, T), [xa, Re, Me];
    });
  }, Wt = (t, e) => {
    for (var r = [], n = 0; n < t; n++)
      r.push(A[e + n * 4 >> 2]);
    return r;
  };
  function qr(t) {
    for (var e = 1; e < t.length; ++e)
      if (t[e] !== null && t[e].destructorFunction === void 0)
        return !0;
    return !1;
  }
  function Vt(t, e, r, n, o, i) {
    var s = e.length;
    s < 2 && C("argTypes array size mismatch! Must at least get return value and 'this' types!");
    var u = e[1] !== null && r !== null, c = qr(e), f = !e[0].isVoid, p = s - 2, m = new Array(p), $ = [], E = [], O = function() {
      E.length = 0;
      var P;
      $.length = u ? 2 : 1, $[0] = o, u && (P = e[1].toWireType(E, this), $[1] = P);
      for (var _ = 0; _ < p; ++_)
        m[_] = e[_ + 2].toWireType(E, _ < 0 || arguments.length <= _ ? void 0 : arguments[_]), $.push(m[_]);
      var T = n(...$);
      function j(F) {
        if (c)
          Ft(E);
        else
          for (var z = u ? 1 : 2; z < e.length; z++) {
            var Pt = z === 1 ? P : m[z - 2];
            e[z].destructorFunction !== null && e[z].destructorFunction(Pt);
          }
        if (f)
          return e[0].fromWireType(F);
      }
      return j(T);
    };
    return Lt(t, O);
  }
  var Yr = (t, e, r, n, o, i) => {
    var s = Wt(e, r);
    o = B(n, o), K([], [t], (u) => {
      u = u[0];
      var c = `constructor ${u.name}`;
      if (u.registeredClass.constructor_body === void 0 && (u.registeredClass.constructor_body = []), u.registeredClass.constructor_body[e - 1] !== void 0)
        throw new ut(`Cannot register multiple constructors with identical number of parameters (${e - 1}) for class '${u.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
      return u.registeredClass.constructor_body[e - 1] = () => {
        _t(`Cannot construct ${u.name} due to unbound types`, s);
      }, K([], s, (f) => (f.splice(1, 0, null), u.registeredClass.constructor_body[e - 1] = Vt(c, f, null, o, i), [])), [];
    });
  }, he = (t) => {
    t = t.trim();
    const e = t.indexOf("(");
    return e === -1 ? t : t.slice(0, e);
  }, Zr = (t, e, r, n, o, i, s, u, c, f) => {
    var p = Wt(r, n);
    e = M(e), e = he(e), i = B(o, i), K([], [t], (m) => {
      m = m[0];
      var $ = `${m.name}.${e}`;
      e.startsWith("@@") && (e = Symbol[e.substring(2)]), u && m.registeredClass.pureVirtualFunctions.push(e);
      function E() {
        _t(`Cannot call ${$} due to unbound types`, p);
      }
      var O = m.registeredClass.instancePrototype, P = O[e];
      return P === void 0 || P.overloadTable === void 0 && P.className !== m.name && P.argCount === r - 2 ? (E.argCount = r - 2, E.className = m.name, O[e] = E) : (se(O, e, $), O[e].overloadTable[r - 2] = E), K([], p, (_) => {
        var T = Vt($, _, m, i, s);
        return O[e].overloadTable === void 0 ? (T.argCount = r - 2, O[e] = T) : O[e].overloadTable[r - 2] = T, [];
      }), [];
    });
  }, pe = [], tt = [0, 1, , 1, null, 1, !0, 1, !1, 1], Gt = (t) => {
    t > 9 && --tt[t + 1] === 0 && (tt[t] = void 0, pe.push(t));
  }, k = {
    toValue: (t) => (t || C(`Cannot use deleted val. handle = ${t}`), tt[t]),
    toHandle: (t) => {
      switch (t) {
        case void 0:
          return 2;
        case null:
          return 4;
        case !0:
          return 6;
        case !1:
          return 8;
        default: {
          const e = pe.pop() || tt.length;
          return tt[e] = t, tt[e + 1] = 1, e;
        }
      }
    }
  }, me = {
    name: "emscripten::val",
    fromWireType: (t) => {
      var e = k.toValue(t);
      return Gt(t), e;
    },
    toWireType: (t, e) => k.toHandle(e),
    readValueFromPointer: st,
    destructorFunction: null
  }, Jr = (t) => U(t, me), Kr = (t, e) => {
    switch (e) {
      case 4:
        return function(r) {
          return this.fromWireType(Zt[r >> 2]);
        };
      case 8:
        return function(r) {
          return this.fromWireType(Jt[r >> 3]);
        };
      default:
        throw new TypeError(`invalid float width (${e}): ${t}`);
    }
  }, tn = (t, e, r) => {
    e = M(e), U(t, {
      name: e,
      fromWireType: (n) => n,
      toWireType: (n, o) => o,
      readValueFromPointer: Kr(e, r),
      destructorFunction: null
    });
  }, en = (t, e, r, n, o, i, s, u) => {
    var c = Wt(e, r);
    t = M(t), t = he(t), o = B(n, o), ue(t, function() {
      _t(`Cannot call ${t} due to unbound types`, c);
    }, e - 1), K([], c, (f) => {
      var p = [f[0], null].concat(f.slice(1));
      return le(t, Vt(t, p, null, o, i), e - 1), [];
    });
  }, rn = (t, e, r) => {
    switch (e) {
      case 1:
        return r ? (n) => Z[n] : (n) => G[n];
      case 2:
        return r ? (n) => pt[n >> 1] : (n) => ot[n >> 1];
      case 4:
        return r ? (n) => it[n >> 2] : (n) => A[n >> 2];
      default:
        throw new TypeError(`invalid integer width (${e}): ${t}`);
    }
  }, nn = (t, e, r, n, o) => {
    e = M(e);
    const i = n === 0;
    let s = (c) => c;
    if (i) {
      var u = 32 - 8 * r;
      s = (c) => c << u >>> u, o = s(o);
    }
    U(t, {
      name: e,
      fromWireType: s,
      toWireType: (c, f) => f,
      readValueFromPointer: rn(e, r, n !== 0),
      destructorFunction: null
    });
  }, an = (t, e, r) => {
    var n = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], o = n[e];
    function i(s) {
      var u = A[s >> 2], c = A[s + 4 >> 2];
      return new o(Z.buffer, c, u);
    }
    r = M(r), U(t, {
      name: r,
      fromWireType: i,
      readValueFromPointer: i
    }, {
      ignoreDuplicateRegistrations: !0
    });
  }, on = Object.assign({
    optional: !0
  }, me), sn = (t, e) => {
    U(t, on);
  }, un = (t, e, r, n) => {
    if (!(n > 0)) return 0;
    for (var o = r, i = r + n - 1, s = 0; s < t.length; ++s) {
      var u = t.codePointAt(s);
      if (u <= 127) {
        if (r >= i) break;
        e[r++] = u;
      } else if (u <= 2047) {
        if (r + 1 >= i) break;
        e[r++] = 192 | u >> 6, e[r++] = 128 | u & 63;
      } else if (u <= 65535) {
        if (r + 2 >= i) break;
        e[r++] = 224 | u >> 12, e[r++] = 128 | u >> 6 & 63, e[r++] = 128 | u & 63;
      } else {
        if (r + 3 >= i) break;
        e[r++] = 240 | u >> 18, e[r++] = 128 | u >> 12 & 63, e[r++] = 128 | u >> 6 & 63, e[r++] = 128 | u & 63, s++;
      }
    }
    return e[r] = 0, r - o;
  }, nt = (t, e, r) => un(t, G, e, r), ye = (t) => {
    for (var e = 0, r = 0; r < t.length; ++r) {
      var n = t.charCodeAt(r);
      n <= 127 ? e++ : n <= 2047 ? e += 2 : n >= 55296 && n <= 57343 ? (e += 4, ++r) : e += 3;
    }
    return e;
  }, ve = globalThis.TextDecoder && new TextDecoder(), ge = (t, e, r, n) => {
    var o = e + r;
    if (n) return o;
    for (; t[e] && !(e >= o); ) ++e;
    return e;
  }, we = function(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, r = arguments.length > 2 ? arguments[2] : void 0, n = arguments.length > 3 ? arguments[3] : void 0;
    var o = ge(t, e, r, n);
    if (o - e > 16 && t.buffer && ve)
      return ve.decode(t.subarray(e, o));
    for (var i = ""; e < o; ) {
      var s = t[e++];
      if (!(s & 128)) {
        i += String.fromCharCode(s);
        continue;
      }
      var u = t[e++] & 63;
      if ((s & 224) == 192) {
        i += String.fromCharCode((s & 31) << 6 | u);
        continue;
      }
      var c = t[e++] & 63;
      if ((s & 240) == 224 ? s = (s & 15) << 12 | u << 6 | c : s = (s & 7) << 18 | u << 12 | c << 6 | t[e++] & 63, s < 65536)
        i += String.fromCharCode(s);
      else {
        var f = s - 65536;
        i += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023);
      }
    }
    return i;
  }, cn = (t, e, r) => t ? we(G, t, e, r) : "", ln = (t, e) => {
    e = M(e), U(t, {
      name: e,
      fromWireType(r) {
        var n = A[r >> 2], o = r + 4, i;
        return i = cn(o, n, !0), Q(r), i;
      },
      toWireType(r, n) {
        n instanceof ArrayBuffer && (n = new Uint8Array(n));
        var o, i = typeof n == "string";
        i || ArrayBuffer.isView(n) && n.BYTES_PER_ELEMENT == 1 || C("Cannot pass non-string to std::string"), i ? o = ye(n) : o = n.length;
        var s = Nt(4 + o + 1), u = s + 4;
        return A[s >> 2] = o, i ? nt(n, u, o + 1) : G.set(n, u), r !== null && r.push(Q, s), s;
      },
      readValueFromPointer: st,
      destructorFunction(r) {
        Q(r);
      }
    });
  }, be = globalThis.TextDecoder ? new TextDecoder("utf-16le") : void 0, dn = (t, e, r) => {
    var n = t >> 1, o = ge(ot, n, e / 2, r);
    if (o - n > 16 && be) return be.decode(ot.subarray(n, o));
    for (var i = "", s = n; s < o; ++s) {
      var u = ot[s];
      i += String.fromCharCode(u);
    }
    return i;
  }, fn = (t, e, r) => {
    if (r != null || (r = 2147483647), r < 2) return 0;
    r -= 2;
    for (var n = e, o = r < t.length * 2 ? r / 2 : t.length, i = 0; i < o; ++i) {
      var s = t.charCodeAt(i);
      pt[e >> 1] = s, e += 2;
    }
    return pt[e >> 1] = 0, e - n;
  }, hn = (t) => t.length * 2, pn = (t, e, r) => {
    for (var n = "", o = t >> 2, i = 0; !(i >= e / 4); i++) {
      var s = A[o + i];
      if (!s && !r) break;
      n += String.fromCodePoint(s);
    }
    return n;
  }, mn = (t, e, r) => {
    if (r != null || (r = 2147483647), r < 4) return 0;
    for (var n = e, o = n + r - 4, i = 0; i < t.length; ++i) {
      var s = t.codePointAt(i);
      if (s > 65535 && i++, it[e >> 2] = s, e += 4, e + 4 > o) break;
    }
    return it[e >> 2] = 0, e - n;
  }, yn = (t) => {
    for (var e = 0, r = 0; r < t.length; ++r) {
      var n = t.codePointAt(r);
      n > 65535 && r++, e += 4;
    }
    return e;
  }, vn = (t, e, r) => {
    r = M(r);
    var n, o, i;
    e === 2 ? (n = dn, o = fn, i = hn) : (n = pn, o = mn, i = yn), U(t, {
      name: r,
      fromWireType: (s) => {
        var u = A[s >> 2], c = n(s + 4, u * e, !0);
        return Q(s), c;
      },
      toWireType: (s, u) => {
        typeof u != "string" && C(`Cannot pass non-string to C++ string type ${r}`);
        var c = i(u), f = Nt(4 + c + e);
        return A[f >> 2] = c / e, o(u, f + 4, c + e), s !== null && s.push(Q, f), f;
      },
      readValueFromPointer: st,
      destructorFunction(s) {
        Q(s);
      }
    });
  }, gn = (t, e, r, n, o, i) => {
    wt[t] = {
      name: M(e),
      rawConstructor: B(r, n),
      rawDestructor: B(o, i),
      fields: []
    };
  }, wn = (t, e, r, n, o, i, s, u, c, f) => {
    wt[t].fields.push({
      fieldName: M(e),
      getterReturnType: r,
      getter: B(n, o),
      getterContext: i,
      setterArgumentType: s,
      setter: B(u, c),
      setterContext: f
    });
  }, bn = (t, e) => {
    e = M(e), U(t, {
      isVoid: !0,
      name: e,
      fromWireType: () => {
      },
      toWireType: (r, n) => {
      }
    });
  }, Ht = [], Cn = (t) => {
    var e = Ht.length;
    return Ht.push(t), e;
  }, $n = (t, e) => {
    var r = J[t];
    return r === void 0 && C(`${e} has unknown type ${fe(t)}`), r;
  }, Tn = (t, e) => {
    for (var r = new Array(t), n = 0; n < t; ++n)
      r[n] = $n(A[e + n * 4 >> 2], `parameter ${n}`);
    return r;
  }, En = (t, e, r) => {
    var n = [], o = t(n, r);
    return n.length && (A[e >> 2] = k.toHandle(n)), o;
  }, _n = {}, Ce = (t) => {
    var e = _n[t];
    return e === void 0 ? M(t) : e;
  }, An = (t, e, r) => {
    var n = 8, [o, ...i] = Tn(t, e), s = o.toWireType.bind(o), u = i.map((m) => m.readValueFromPointer.bind(m));
    t--;
    var c = new Array(t), f = (m, $, E, O) => {
      for (var P = 0, _ = 0; _ < t; ++_)
        c[_] = u[_](O + P), P += n;
      var T;
      switch (r) {
        case 0:
          T = k.toValue(m).apply(null, c);
          break;
        case 2:
          T = Reflect.construct(k.toValue(m), c);
          break;
        case 3:
          T = c[0];
          break;
        case 1:
          T = k.toValue(m)[Ce($)](...c);
          break;
      }
      return En(s, E, T);
    }, p = `methodCaller<(${i.map((m) => m.name)}) => ${o.name}>`;
    return Cn(Lt(p, f));
  }, Pn = (t) => t ? (t = Ce(t), k.toHandle(globalThis[t])) : k.toHandle(globalThis), On = (t) => {
    t > 9 && (tt[t + 1] += 1);
  }, xn = (t, e, r, n, o) => Ht[t](e, r, n, o), Dn = (t) => {
    var e = k.toValue(t);
    Ft(e), Gt(t);
  }, In = (t, e, r, n) => {
    var o = (/* @__PURE__ */ new Date()).getFullYear(), i = new Date(o, 0, 1), s = new Date(o, 6, 1), u = i.getTimezoneOffset(), c = s.getTimezoneOffset(), f = Math.max(u, c);
    A[t >> 2] = f * 60, it[e >> 2] = +(u != c);
    var p = (E) => {
      var O = E >= 0 ? "-" : "+", P = Math.abs(E), _ = String(Math.floor(P / 60)).padStart(2, "0"), T = String(P % 60).padStart(2, "0");
      return `UTC${O}${_}${T}`;
    }, m = p(u), $ = p(c);
    c < u ? (nt(m, r, 17), nt($, n, 17)) : (nt(m, n, 17), nt($, r, 17));
  }, Sn = () => 2147483648, Rn = (t, e) => Math.ceil(t / e) * e, Mn = (t) => {
    var e = At.buffer.byteLength, r = (t - e + 65535) / 65536 | 0;
    try {
      return At.grow(r), te(), 1;
    } catch {
    }
  }, Fn = (t) => {
    var e = G.length;
    t >>>= 0;
    var r = Sn();
    if (t > r)
      return !1;
    for (var n = 1; n <= 4; n *= 2) {
      var o = e * (1 + 0.2 / n);
      o = Math.min(o, t + 100663296);
      var i = Math.min(r, Rn(Math.max(t, o), 65536)), s = Mn(i);
      if (s)
        return !0;
    }
    return !1;
  }, zt = {}, Bn = () => x || "./this.program", lt = () => {
    if (!lt.strings) {
      var t = (typeof navigator == "object" && navigator.language || "C").replace("-", "_") + ".UTF-8", e = {
        USER: "web_user",
        LOGNAME: "web_user",
        PATH: "/",
        PWD: "/",
        HOME: "/home/web_user",
        LANG: t,
        _: Bn()
      };
      for (var r in zt)
        zt[r] === void 0 ? delete e[r] : e[r] = zt[r];
      var n = [];
      for (var r in e)
        n.push(`${r}=${e[r]}`);
      lt.strings = n;
    }
    return lt.strings;
  }, jn = (t, e) => {
    var r = 0, n = 0;
    for (var o of lt()) {
      var i = e + r;
      A[t + n >> 2] = i, r += nt(o, i, 1 / 0) + 1, n += 4;
    }
    return 0;
  }, Ln = (t, e) => {
    var r = lt();
    A[t >> 2] = r.length;
    var n = 0;
    for (var o of r)
      n += ye(o) + 1;
    return A[e >> 2] = n, 0;
  }, Un = (t) => 52;
  function kn(t, e, r, n, o) {
    return 70;
  }
  var Wn = [null, [], []], Vn = (t, e) => {
    var r = Wn[t];
    e === 0 || e === 10 ? ((t === 1 ? at : V)(we(r)), r.length = 0) : r.push(e);
  }, Gn = (t, e, r, n) => {
    for (var o = 0, i = 0; i < r; i++) {
      var s = A[e >> 2], u = A[e + 4 >> 2];
      e += 8;
      for (var c = 0; c < u; c++)
        Vn(t, G[s + c]);
      o += u;
    }
    return A[n >> 2] = o, 0;
  }, Hn = (t) => t;
  if (Ir(), Gr(), d.noExitRuntime && d.noExitRuntime, d.print && (at = d.print), d.printErr && (V = d.printErr), d.wasmBinary && (Y = d.wasmBinary), d.arguments && d.arguments, d.thisProgram && (x = d.thisProgram), d.preInit)
    for (typeof d.preInit == "function" && (d.preInit = [d.preInit]); d.preInit.length > 0; )
      d.preInit.shift()();
  var $e, Q, Nt, Te, y, Ee, _e, Ae, Pe, Oe, xe, De, Ie, At, Se;
  function zn(t) {
    $e = t.ya, Q = d._free = t.za, Nt = d._malloc = t.Ba, Te = t.Ca, y = t.Da, Ee = t.Ea, _e = t.Fa, Ae = t.Ga, Pe = t.Ha, Oe = t.Ia, xe = t.Ja, N.viijii = t.Ka, De = N.iiijj = t.La, N.jiji = t.Ma, Ie = N.jiiii = t.Na, N.iiiiij = t.Oa, N.iiiiijj = t.Pa, N.iiiiiijj = t.Qa, At = t.wa, Se = t.Aa;
  }
  var Nn = {
    s: pr,
    x: mr,
    a: yr,
    j: vr,
    m: gr,
    P: wr,
    q: br,
    U: Cr,
    d: $r,
    ba: Tr,
    ta: _r,
    aa: Ar,
    oa: Or,
    ra: Xr,
    qa: Yr,
    F: Zr,
    ma: Jr,
    W: tn,
    X: en,
    z: nn,
    t: an,
    sa: sn,
    na: ln,
    R: vn,
    G: gn,
    ua: wn,
    pa: bn,
    M: An,
    va: Gt,
    C: Pn,
    S: On,
    L: xn,
    ha: Dn,
    ca: In,
    fa: Fn,
    da: jn,
    ea: Ln,
    ga: Un,
    _: kn,
    V: Gn,
    J: ya,
    B: ga,
    Y: ta,
    T: Ta,
    r: fa,
    b: qn,
    D: ma,
    ja: ba,
    c: Zn,
    ia: Ca,
    h: Kn,
    i: ia,
    p: ua,
    O: pa,
    w: la,
    E: da,
    K: ha,
    I: Ea,
    $: Aa,
    Z: Pa,
    f: ea,
    l: Qn,
    e: Yn,
    g: Jn,
    N: $a,
    k: Xn,
    ka: va,
    o: ca,
    y: na,
    u: sa,
    Q: oa,
    v: wa,
    n: ra,
    H: _a,
    la: aa,
    A: Hn
  };
  function Qn(t, e) {
    var r = g();
    try {
      w(t)(e);
    } catch (n) {
      if (v(r), n !== n + 0) throw n;
      y(1, 0);
    }
  }
  function Xn(t, e, r, n, o) {
    var i = g();
    try {
      w(t)(e, r, n, o);
    } catch (s) {
      if (v(i), s !== s + 0) throw s;
      y(1, 0);
    }
  }
  function qn(t, e) {
    var r = g();
    try {
      return w(t)(e);
    } catch (n) {
      if (v(r), n !== n + 0) throw n;
      y(1, 0);
    }
  }
  function Yn(t, e, r) {
    var n = g();
    try {
      w(t)(e, r);
    } catch (o) {
      if (v(n), o !== o + 0) throw o;
      y(1, 0);
    }
  }
  function Zn(t, e, r) {
    var n = g();
    try {
      return w(t)(e, r);
    } catch (o) {
      if (v(n), o !== o + 0) throw o;
      y(1, 0);
    }
  }
  function Jn(t, e, r, n) {
    var o = g();
    try {
      w(t)(e, r, n);
    } catch (i) {
      if (v(o), i !== i + 0) throw i;
      y(1, 0);
    }
  }
  function Kn(t, e, r, n) {
    var o = g();
    try {
      return w(t)(e, r, n);
    } catch (i) {
      if (v(o), i !== i + 0) throw i;
      y(1, 0);
    }
  }
  function ta(t, e, r, n, o, i) {
    var s = g();
    try {
      return w(t)(e, r, n, o, i);
    } catch (u) {
      if (v(s), u !== u + 0) throw u;
      y(1, 0);
    }
  }
  function ea(t) {
    var e = g();
    try {
      w(t)();
    } catch (r) {
      if (v(e), r !== r + 0) throw r;
      y(1, 0);
    }
  }
  function ra(t, e, r, n, o, i, s, u, c, f, p) {
    var m = g();
    try {
      w(t)(e, r, n, o, i, s, u, c, f, p);
    } catch ($) {
      if (v(m), $ !== $ + 0) throw $;
      y(1, 0);
    }
  }
  function na(t, e, r, n, o, i, s) {
    var u = g();
    try {
      w(t)(e, r, n, o, i, s);
    } catch (c) {
      if (v(u), c !== c + 0) throw c;
      y(1, 0);
    }
  }
  function aa(t, e, r, n, o, i, s, u, c, f, p, m, $, E, O, P, _) {
    var T = g();
    try {
      w(t)(e, r, n, o, i, s, u, c, f, p, m, $, E, O, P, _);
    } catch (j) {
      if (v(T), j !== j + 0) throw j;
      y(1, 0);
    }
  }
  function oa(t, e, r, n, o, i, s, u, c) {
    var f = g();
    try {
      w(t)(e, r, n, o, i, s, u, c);
    } catch (p) {
      if (v(f), p !== p + 0) throw p;
      y(1, 0);
    }
  }
  function ia(t, e, r, n, o) {
    var i = g();
    try {
      return w(t)(e, r, n, o);
    } catch (s) {
      if (v(i), s !== s + 0) throw s;
      y(1, 0);
    }
  }
  function sa(t, e, r, n, o, i, s, u) {
    var c = g();
    try {
      w(t)(e, r, n, o, i, s, u);
    } catch (f) {
      if (v(c), f !== f + 0) throw f;
      y(1, 0);
    }
  }
  function ua(t, e, r, n, o, i) {
    var s = g();
    try {
      return w(t)(e, r, n, o, i);
    } catch (u) {
      if (v(s), u !== u + 0) throw u;
      y(1, 0);
    }
  }
  function ca(t, e, r, n, o, i) {
    var s = g();
    try {
      w(t)(e, r, n, o, i);
    } catch (u) {
      if (v(s), u !== u + 0) throw u;
      y(1, 0);
    }
  }
  function la(t, e, r, n, o, i, s) {
    var u = g();
    try {
      return w(t)(e, r, n, o, i, s);
    } catch (c) {
      if (v(u), c !== c + 0) throw c;
      y(1, 0);
    }
  }
  function da(t, e, r, n, o, i, s, u) {
    var c = g();
    try {
      return w(t)(e, r, n, o, i, s, u);
    } catch (f) {
      if (v(c), f !== f + 0) throw f;
      y(1, 0);
    }
  }
  function fa(t) {
    var e = g();
    try {
      return w(t)();
    } catch (r) {
      if (v(e), r !== r + 0) throw r;
      y(1, 0);
    }
  }
  function ha(t, e, r, n, o, i, s, u, c) {
    var f = g();
    try {
      return w(t)(e, r, n, o, i, s, u, c);
    } catch (p) {
      if (v(f), p !== p + 0) throw p;
      y(1, 0);
    }
  }
  function pa(t, e, r, n, o, i, s) {
    var u = g();
    try {
      return w(t)(e, r, n, o, i, s);
    } catch (c) {
      if (v(u), c !== c + 0) throw c;
      y(1, 0);
    }
  }
  function ma(t, e, r, n) {
    var o = g();
    try {
      return w(t)(e, r, n);
    } catch (i) {
      if (v(o), i !== i + 0) throw i;
      y(1, 0);
    }
  }
  function ya(t, e, r, n) {
    var o = g();
    try {
      return w(t)(e, r, n);
    } catch (i) {
      if (v(o), i !== i + 0) throw i;
      y(1, 0);
    }
  }
  function va(t, e, r, n, o, i, s, u) {
    var c = g();
    try {
      w(t)(e, r, n, o, i, s, u);
    } catch (f) {
      if (v(c), f !== f + 0) throw f;
      y(1, 0);
    }
  }
  function ga(t, e, r, n, o, i) {
    var s = g();
    try {
      return w(t)(e, r, n, o, i);
    } catch (u) {
      if (v(s), u !== u + 0) throw u;
      y(1, 0);
    }
  }
  function wa(t, e, r, n, o, i, s, u, c, f) {
    var p = g();
    try {
      w(t)(e, r, n, o, i, s, u, c, f);
    } catch (m) {
      if (v(p), m !== m + 0) throw m;
      y(1, 0);
    }
  }
  function ba(t, e, r) {
    var n = g();
    try {
      return w(t)(e, r);
    } catch (o) {
      if (v(n), o !== o + 0) throw o;
      y(1, 0);
    }
  }
  function Ca(t, e, r, n, o) {
    var i = g();
    try {
      return w(t)(e, r, n, o);
    } catch (s) {
      if (v(i), s !== s + 0) throw s;
      y(1, 0);
    }
  }
  function $a(t, e, r, n, o, i, s) {
    var u = g();
    try {
      w(t)(e, r, n, o, i, s);
    } catch (c) {
      if (v(u), c !== c + 0) throw c;
      y(1, 0);
    }
  }
  function Ta(t, e, r, n) {
    var o = g();
    try {
      return w(t)(e, r, n);
    } catch (i) {
      if (v(o), i !== i + 0) throw i;
      y(1, 0);
    }
  }
  function Ea(t, e, r, n, o, i, s, u, c, f, p, m) {
    var $ = g();
    try {
      return w(t)(e, r, n, o, i, s, u, c, f, p, m);
    } catch (E) {
      if (v($), E !== E + 0) throw E;
      y(1, 0);
    }
  }
  function _a(t, e, r, n, o, i, s, u, c, f, p, m, $, E, O, P) {
    var _ = g();
    try {
      w(t)(e, r, n, o, i, s, u, c, f, p, m, $, E, O, P);
    } catch (T) {
      if (v(_), T !== T + 0) throw T;
      y(1, 0);
    }
  }
  function Aa(t, e, r, n, o, i, s) {
    var u = g();
    try {
      return De(t, e, r, n, o, i, s);
    } catch (c) {
      if (v(u), c !== c + 0) throw c;
      y(1, 0);
    }
  }
  function Pa(t, e, r, n, o) {
    var i = g();
    try {
      return Ie(t, e, r, n, o);
    } catch (s) {
      if (v(i), s !== s + 0) throw s;
      y(1, 0);
    }
  }
  function Oa() {
    rr();
    function t() {
      var e, r;
      d.calledRun = !0, !ht && (nr(), (e = qt) === null || e === void 0 || e(d), (r = d.onRuntimeInitialized) === null || r === void 0 || r.call(d), ar());
    }
    d.setStatus ? (d.setStatus("Running..."), setTimeout(() => {
      setTimeout(() => d.setStatus(""), 1), t();
    }, 1)) : t();
  }
  var dt;
  return dt = await dr(), Oa(), Kt ? l = d : l = new Promise((t, e) => {
    qt = t, Yt = e;
  }), l;
}
function Ne(a) {
  return ze(Xt, a);
}
function Eo() {
  return eo(Xt);
}
function _o(a) {
  Ne({
    overrides: a,
    equalityFn: Object.is,
    fireImmediately: !1
  });
}
async function no(a, l) {
  return ro(Xt, a, l);
}
const Ao = "c25c09c3a8ec3118f96d224491c9a20cc6ad4302b70eb0e4b941772c2982a920", Qe = [
  ["aztec", "Aztec"],
  ["aztec_code", "AztecCode"],
  ["aztec_rune", "AztecRune"],
  ["code_128", "Code128"],
  ["code_39", "Code39"],
  ["code_39_standard", "Code39Std"],
  ["code_39_extended", "Code39Ext"],
  ["code_32", "Code32"],
  ["pzn", "PZN"],
  ["code_93", "Code93"],
  ["codabar", "Codabar"],
  ["databar", "DataBar"],
  ["databar_omni", "DataBarOmni"],
  ["databar_stacked", "DataBarStk"],
  ["databar_stacked_omni", "DataBarStkOmni"],
  ["databar_expanded", "DataBarExp"],
  ["databar_expanded_stacked", "DataBarExpStk"],
  ["databar_limited", "DataBarLtd"],
  ["data_matrix", "DataMatrix"],
  ["dx_film_edge", "DXFilmEdge"],
  ["ean_13", "EAN13"],
  ["ean_upc", "EANUPC"],
  ["isbn", "ISBN"],
  ["ean_8", "EAN8"],
  ["itf", "ITF"],
  ["itf_14", "ITF14"],
  ["maxi_code", "MaxiCode"],
  ["micro_qr_code", "MicroQRCode"],
  ["pdf417", "PDF417"],
  ["compact_pdf417", "CompactPDF417"],
  ["qr_code", "QRCode"],
  ["qr_code_model_1", "QRCodeModel1"],
  ["qr_code_model_2", "QRCodeModel2"],
  ["rm_qr_code", "RMQRCode"],
  ["upc_a", "UPCA"],
  ["upc_e", "UPCE"],
  ["other_barcode", "OtherBarcode"],
  ["linear_codes", "AllLinear"],
  ["matrix_codes", "AllMatrix"],
  ["gs1_codes", "AllGS1"],
  ["retail_codes", "AllRetail"],
  ["industrial_codes", "AllIndustrial"],
  ["any", "All"]
], ao = [...Qe, ["unknown"]].map((a) => a[0]), Qt = new Map(
  Qe
);
function oo(a) {
  for (const [l, h] of Qt)
    if (a === h)
      return l;
  return "unknown";
}
function io(a) {
  if (Xe(a))
    return {
      width: a.naturalWidth,
      height: a.naturalHeight
    };
  if (qe(a))
    return {
      width: a.width.baseVal.value,
      height: a.height.baseVal.value
    };
  if (Ye(a))
    return {
      width: a.videoWidth,
      height: a.videoHeight
    };
  if (Je(a))
    return {
      width: a.width,
      height: a.height
    };
  if (tr(a))
    return {
      width: a.displayWidth,
      height: a.displayHeight
    };
  if (Ze(a))
    return {
      width: a.width,
      height: a.height
    };
  if (Ke(a))
    return {
      width: a.width,
      height: a.height
    };
  throw new TypeError(
    "The provided value is not of type '(Blob or HTMLCanvasElement or HTMLImageElement or HTMLVideoElement or ImageBitmap or ImageData or OffscreenCanvas or SVGImageElement or VideoFrame)'."
  );
}
function Xe(a) {
  var l, h;
  try {
    return a instanceof ((h = (l = a == null ? void 0 : a.ownerDocument) == null ? void 0 : l.defaultView) == null ? void 0 : h.HTMLImageElement);
  } catch {
    return !1;
  }
}
function qe(a) {
  var l, h;
  try {
    return a instanceof ((h = (l = a == null ? void 0 : a.ownerDocument) == null ? void 0 : l.defaultView) == null ? void 0 : h.SVGImageElement);
  } catch {
    return !1;
  }
}
function Ye(a) {
  var l, h;
  try {
    return a instanceof ((h = (l = a == null ? void 0 : a.ownerDocument) == null ? void 0 : l.defaultView) == null ? void 0 : h.HTMLVideoElement);
  } catch {
    return !1;
  }
}
function Ze(a) {
  var l, h;
  try {
    return a instanceof ((h = (l = a == null ? void 0 : a.ownerDocument) == null ? void 0 : l.defaultView) == null ? void 0 : h.HTMLCanvasElement);
  } catch {
    return !1;
  }
}
function Je(a) {
  try {
    return a instanceof ImageBitmap || Object.prototype.toString.call(a) === "[object ImageBitmap]";
  } catch {
    return !1;
  }
}
function Ke(a) {
  try {
    return a instanceof OffscreenCanvas || Object.prototype.toString.call(a) === "[object OffscreenCanvas]";
  } catch {
    return !1;
  }
}
function tr(a) {
  try {
    return a instanceof VideoFrame || Object.prototype.toString.call(a) === "[object VideoFrame]";
  } catch {
    return !1;
  }
}
function so(a) {
  try {
    return a instanceof Blob || Object.prototype.toString.call(a) === "[object Blob]";
  } catch {
    return !1;
  }
}
function uo(a) {
  try {
    return a instanceof ImageData || Object.prototype.toString.call(a) === "[object ImageData]";
  } catch {
    return !1;
  }
}
function co(a, l) {
  try {
    const h = new OffscreenCanvas(a, l);
    if (h.getContext("2d") instanceof OffscreenCanvasRenderingContext2D)
      return h;
    throw void 0;
  } catch {
    const h = document.createElement("canvas");
    return h.width = a, h.height = l, h;
  }
}
async function er(a) {
  if (Xe(a) && !await po(a))
    throw new DOMException(
      "Failed to load or decode HTMLImageElement.",
      "InvalidStateError"
    );
  if (qe(a) && !await mo(a))
    throw new DOMException(
      "Failed to load or decode SVGImageElement.",
      "InvalidStateError"
    );
  if (tr(a) && yo(a))
    throw new DOMException("VideoFrame is closed.", "InvalidStateError");
  if (Ye(a) && (a.readyState === 0 || a.readyState === 1))
    throw new DOMException("Invalid element or state.", "InvalidStateError");
  if (Je(a) && go(a))
    throw new DOMException(
      "The image source is detached.",
      "InvalidStateError"
    );
  const { width: l, height: h } = io(a);
  if (l === 0 || h === 0)
    return null;
  const d = co(l, h).getContext("2d");
  d.drawImage(a, 0, 0);
  try {
    return d.getImageData(0, 0, l, h);
  } catch {
    throw new DOMException("Source would taint origin.", "SecurityError");
  }
}
async function lo(a) {
  let l;
  try {
    l = await createImageBitmap(a);
  } catch {
    try {
      if (globalThis.Image) {
        l = new Image();
        let d = "";
        try {
          d = URL.createObjectURL(a), l.src = d, await l.decode();
        } finally {
          URL.revokeObjectURL(d);
        }
      } else
        return a;
    } catch {
      throw new DOMException(
        "Failed to load or decode Blob.",
        "InvalidStateError"
      );
    }
  }
  return await er(l);
}
function fo(a) {
  const { width: l, height: h } = a;
  if (l === 0 || h === 0)
    return null;
  const b = a.getContext("2d");
  try {
    return b.getImageData(0, 0, l, h);
  } catch {
    throw new DOMException("Source would taint origin.", "SecurityError");
  }
}
async function ho(a) {
  if (so(a))
    return await lo(a);
  if (uo(a)) {
    if (vo(a))
      throw new DOMException(
        "The image data has been detached.",
        "InvalidStateError"
      );
    return a;
  }
  return Ze(a) || Ke(a) ? fo(a) : await er(a);
}
async function po(a) {
  try {
    return await a.decode(), !0;
  } catch {
    return !1;
  }
}
async function mo(a) {
  var l;
  try {
    return await ((l = a.decode) == null ? void 0 : l.call(a)), !0;
  } catch {
    return !1;
  }
}
function yo(a) {
  return a.format === null;
}
function vo(a) {
  return a.data.buffer.byteLength === 0;
}
function go(a) {
  return a.width === 0 && a.height === 0;
}
function He(a, l) {
  return wo(a) ? new DOMException(`${l}: ${a.message}`, a.name) : bo(a) ? new a.constructor(`${l}: ${a.message}`) : new Error(`${l}: ${a}`);
}
function wo(a) {
  return a instanceof DOMException || Object.prototype.toString.call(a) === "[object DOMException]";
}
function bo(a) {
  return a instanceof Error || Object.prototype.toString.call(a) === "[object Error]";
}
var ft;
class Po {
  constructor(l = {}) {
    ke(this, ft);
    var h;
    try {
      const b = (h = l == null ? void 0 : l.formats) == null ? void 0 : h.filter(
        (d) => d !== "unknown"
      );
      if ((b == null ? void 0 : b.length) === 0)
        throw new TypeError("Hint option provided, but is empty.");
      for (const d of b != null ? b : [])
        if (!Qt.has(d))
          throw new TypeError(
            `Failed to read the 'formats' property from 'BarcodeDetectorOptions': The provided value '${d}' is not a valid enum value of type BarcodeFormat.`
          );
      We(this, ft, b != null ? b : []), Ne({ fireImmediately: !0 }).catch(() => {
      });
    } catch (b) {
      throw He(
        b,
        "Failed to construct 'BarcodeDetector'"
      );
    }
  }
  static async getSupportedFormats() {
    return ao.filter((l) => l !== "unknown");
  }
  async detect(l) {
    try {
      const h = await ho(l);
      if (h === null)
        return [];
      let b;
      const d = {
        textMode: "Plain",
        formats: Ue(this, ft).map((D) => Qt.get(D))
      };
      try {
        b = await no(h, d);
      } catch (D) {
        throw console.error(D), new DOMException(
          "Barcode detection service unavailable.",
          "NotSupportedError"
        );
      }
      return b.map((D) => {
        const {
          topLeft: { x: I, y: S },
          topRight: { x, y: R },
          bottomLeft: { x: W, y: X },
          bottomRight: { x: et, y: q }
        } = D.position, at = Math.min(I, x, W, et), V = Math.min(S, R, X, q), Y = Math.max(I, x, W, et), ht = Math.max(S, R, X, q);
        return {
          boundingBox: new DOMRectReadOnly(
            at,
            V,
            Y - at,
            ht - V
          ),
          rawValue: D.text,
          format: oo(D.format),
          cornerPoints: [
            {
              x: I,
              y: S
            },
            {
              x,
              y: R
            },
            {
              x: et,
              y: q
            },
            {
              x: W,
              y: X
            }
          ]
        };
      });
    } catch (h) {
      throw He(
        h,
        "Failed to execute 'detect' on 'BarcodeDetector'"
      );
    }
  }
}
ft = new WeakMap();
export {
  Po as BarcodeDetector,
  To as ZXING_CPP_COMMIT,
  Ao as ZXING_WASM_SHA256,
  $o as ZXING_WASM_VERSION,
  Ne as prepareZXingModule,
  Eo as purgeZXingModule,
  _o as setZXingModuleOverrides
};
