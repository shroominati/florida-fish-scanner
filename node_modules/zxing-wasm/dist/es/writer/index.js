import { p as hn, a as gn, z as pn } from "../share.js";
import { B as Sn, c as Mn, e as kn, f as On, C as Pn, k as Wn, G as Bn, I as Dn, L as Un, M as In, R as $n, w as Vn, Z as jn, b as Nn, h as Hn, l as Ln, A as xn, o as Xn, q as Zn, s as zn, t as Gn, u as qn, v as Yn, x as Kn } from "../share.js";
async function hr(F = {}) {
  var H, I, nr, v = F, Qr = !!globalThis.window, re = typeof Bun < "u", gr = !!globalThis.WorkerGlobalScope;
  !((I = globalThis.process) === null || I === void 0 || (I = I.versions) === null || I === void 0) && I.node && ((nr = globalThis.process) === null || nr === void 0 ? void 0 : nr.type) != "renderer";
  var pr = "./this.program", ee, ir = "";
  function te(r) {
    return v.locateFile ? v.locateFile(r, ir) : ir + r;
  }
  var yr, ar;
  if (Qr || gr || re) {
    try {
      ir = new URL(".", ee).href;
    } catch {
    }
    gr && (ar = (r) => {
      var e = new XMLHttpRequest();
      return e.open("GET", r, !1), e.responseType = "arraybuffer", e.send(null), new Uint8Array(e.response);
    }), yr = async (r) => {
      var e = await fetch(r, {
        credentials: "same-origin"
      });
      if (e.ok)
        return e.arrayBuffer();
      throw new Error(e.status + " : " + e.url);
    };
  }
  var mr = console.log.bind(console), $ = console.error.bind(console), L, wr = !1, br, Tr, W, E, q, x, X, _, Ar, Rr, Fr = !1;
  function Er() {
    var r = tr.buffer;
    W = new Int8Array(r), q = new Int16Array(r), v.HEAPU8 = E = new Uint8Array(r), x = new Uint16Array(r), X = new Int32Array(r), _ = new Uint32Array(r), Ar = new Float32Array(r), Rr = new Float64Array(r);
  }
  function ne() {
    if (v.preRun)
      for (typeof v.preRun == "function" && (v.preRun = [v.preRun]); v.preRun.length; )
        de(v.preRun.shift());
    Cr(Mr);
  }
  function ie() {
    Fr = !0, G.oa();
  }
  function ae() {
    if (v.postRun)
      for (typeof v.postRun == "function" && (v.postRun = [v.postRun]); v.postRun.length; )
        _e(v.postRun.shift());
    Cr(Sr);
  }
  function or(r) {
    var e, t;
    (e = v.onAbort) === null || e === void 0 || e.call(v, r), r = "Aborted(" + r + ")", $(r), wr = !0, r += ". Build with -sASSERTIONS for more info.";
    var n = new WebAssembly.RuntimeError(r);
    throw (t = Tr) === null || t === void 0 || t(n), n;
  }
  var V;
  function oe() {
    return te("zxing_writer.wasm");
  }
  function se(r) {
    if (r == V && L)
      return new Uint8Array(L);
    if (ar)
      return ar(r);
    throw "both async and sync fetching of the wasm failed";
  }
  async function ue(r) {
    if (!L)
      try {
        var e = await yr(r);
        return new Uint8Array(e);
      } catch {
      }
    return se(r);
  }
  async function fe(r, e) {
    try {
      var t = await ue(r), n = await WebAssembly.instantiate(t, e);
      return n;
    } catch (i) {
      $(`failed to asynchronously prepare wasm: ${i}`), or(i);
    }
  }
  async function ve(r, e, t) {
    if (!r && WebAssembly.instantiateStreaming)
      try {
        var n = fetch(e, {
          credentials: "same-origin"
        }), i = await WebAssembly.instantiateStreaming(n, t);
        return i;
      } catch (a) {
        $(`wasm streaming compile failed: ${a}`), $("falling back to ArrayBuffer instantiation");
      }
    return fe(e, t);
  }
  function ce() {
    var r = {
      a: Nt
    };
    return r;
  }
  async function le() {
    function r(a, o) {
      return G = a.exports, jt(G), Er(), G;
    }
    function e(a) {
      return r(a.instance);
    }
    var t = ce();
    if (v.instantiateWasm)
      return new Promise((a, o) => {
        v.instantiateWasm(t, (s, u) => {
          a(r(s));
        });
      });
    V != null || (V = oe());
    var n = await ve(L, V, t), i = e(n);
    return i;
  }
  var Cr = (r) => {
    for (; r.length > 0; )
      r.shift()(v);
  }, Sr = [], _e = (r) => Sr.push(r), Mr = [], de = (r) => Mr.push(r), g = (r) => xr(r), p = () => Xr(), Y = [], K = 0, he = (r) => {
    var e = new sr(r);
    return e.get_caught() || (e.set_caught(!0), K--), e.set_rethrown(!1), Y.push(e), zr(r), qr(r);
  }, C = 0, ge = () => {
    d(0, 0);
    var r = Y.pop();
    Zr(r.excPtr), C = 0;
  };
  class sr {
    constructor(e) {
      this.excPtr = e, this.ptr = e - 24;
    }
    set_type(e) {
      _[this.ptr + 4 >> 2] = e;
    }
    get_type() {
      return _[this.ptr + 4 >> 2];
    }
    set_destructor(e) {
      _[this.ptr + 8 >> 2] = e;
    }
    get_destructor() {
      return _[this.ptr + 8 >> 2];
    }
    set_caught(e) {
      e = e ? 1 : 0, W[this.ptr + 12] = e;
    }
    get_caught() {
      return W[this.ptr + 12] != 0;
    }
    set_rethrown(e) {
      e = e ? 1 : 0, W[this.ptr + 13] = e;
    }
    get_rethrown() {
      return W[this.ptr + 13] != 0;
    }
    init(e, t) {
      this.set_adjusted_ptr(0), this.set_type(e), this.set_destructor(t);
    }
    set_adjusted_ptr(e) {
      _[this.ptr + 16 >> 2] = e;
    }
    get_adjusted_ptr() {
      return _[this.ptr + 16 >> 2];
    }
  }
  var J = (r) => Lr(r), ur = (r) => {
    var e = C;
    if (!e)
      return J(0), 0;
    var t = new sr(e);
    t.set_adjusted_ptr(e);
    var n = t.get_type();
    if (!n)
      return J(0), e;
    for (var i of r) {
      if (i === 0 || i === n)
        break;
      var a = t.ptr + 16;
      if (Gr(i, n, a))
        return J(i), e;
    }
    return J(n), e;
  }, pe = () => ur([]), ye = (r) => ur([r]), me = (r, e) => ur([r, e]), we = () => {
    var r = Y.pop();
    r || or("no exception to throw");
    var e = r.excPtr;
    throw r.get_rethrown() || (Y.push(r), r.set_rethrown(!0), r.set_caught(!1), K++), C = e, C;
  }, be = (r, e, t) => {
    var n = new sr(r);
    throw n.init(e, t), C = r, K++, C;
  }, Te = () => K, Ae = (r) => {
    throw C || (C = r), C;
  }, kr = globalThis.TextDecoder && new TextDecoder(), Or = (r, e, t, n) => {
    var i = e + t;
    if (n) return i;
    for (; r[e] && !(e >= i); ) ++e;
    return e;
  }, Pr = function(r) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, t = arguments.length > 2 ? arguments[2] : void 0, n = arguments.length > 3 ? arguments[3] : void 0;
    var i = Or(r, e, t, n);
    if (i - e > 16 && r.buffer && kr)
      return kr.decode(r.subarray(e, i));
    for (var a = ""; e < i; ) {
      var o = r[e++];
      if (!(o & 128)) {
        a += String.fromCharCode(o);
        continue;
      }
      var s = r[e++] & 63;
      if ((o & 224) == 192) {
        a += String.fromCharCode((o & 31) << 6 | s);
        continue;
      }
      var u = r[e++] & 63;
      if ((o & 240) == 224 ? o = (o & 15) << 12 | s << 6 | u : o = (o & 7) << 18 | s << 12 | u << 6 | r[e++] & 63, o < 65536)
        a += String.fromCharCode(o);
      else {
        var f = o - 65536;
        a += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023);
      }
    }
    return a;
  }, Re = (r, e, t) => r ? Pr(E, r, e, t) : "";
  function Fe(r, e, t) {
    return 0;
  }
  function Ee(r, e, t) {
    return 0;
  }
  var Ce = (r, e, t) => {
  };
  function Se(r, e, t, n) {
  }
  var Me = (r, e) => {
  }, ke = () => or(""), Q = {}, fr = (r) => {
    for (; r.length; ) {
      var e = r.pop(), t = r.pop();
      t(e);
    }
  };
  function rr(r) {
    return this.fromWireType(_[r >> 2]);
  }
  var j = {}, B = {}, er = {}, Oe = class extends Error {
    constructor(e) {
      super(e), this.name = "InternalError";
    }
  }, Wr = (r) => {
    throw new Oe(r);
  }, Br = (r, e, t) => {
    r.forEach((s) => er[s] = e);
    function n(s) {
      var u = t(s);
      u.length !== r.length && Wr("Mismatched type converter count");
      for (var f = 0; f < r.length; ++f)
        S(r[f], u[f]);
    }
    var i = new Array(e.length), a = [], o = 0;
    {
      const s = e;
      for (let u = 0; u < s.length; ++u) {
        const f = s[u];
        B.hasOwnProperty(f) ? i[u] = B[f] : (a.push(f), j.hasOwnProperty(f) || (j[f] = []), j[f].push(() => {
          i[u] = B[f], ++o, o === a.length && n(i);
        }));
      }
    }
    a.length === 0 && n(i);
  }, Pe = (r) => {
    var e = Q[r];
    delete Q[r];
    var t = e.rawConstructor, n = e.rawDestructor, i = e.fields, a = i.map((o) => o.getterReturnType).concat(i.map((o) => o.setterArgumentType));
    Br([r], a, (o) => {
      var s = {};
      {
        const u = i;
        for (let f = 0; f < u.length; ++f) {
          const c = u[f], l = o[f], y = c.getter, b = c.getterContext, k = o[f + i.length], m = c.setter, A = c.setterContext;
          s[c.fieldName] = {
            read: (w) => l.fromWireType(y(b, w)),
            write: (w, dr) => {
              var O = [];
              m(A, w, k.toWireType(O, dr)), fr(O);
            },
            optional: l.optional
          };
        }
      }
      return [{
        name: e.name,
        fromWireType: (u) => {
          var f = {};
          for (var c in s)
            f[c] = s[c].read(u);
          return n(u), f;
        },
        toWireType: (u, f) => {
          for (var c in s)
            if (!(c in f) && !s[c].optional)
              throw new TypeError(`Missing field: "${c}"`);
          var l = t();
          for (c in s)
            s[c].write(l, f[c]);
          return u !== null && u.push(n, l), l;
        },
        readValueFromPointer: rr,
        destructorFunction: n
      }];
    });
  }, We = (r, e, t, n, i) => {
  }, T = (r) => {
    for (var e = ""; ; ) {
      var t = E[r++];
      if (!t) return e;
      e += String.fromCharCode(t);
    }
  }, Be = class extends Error {
    constructor(e) {
      super(e), this.name = "BindingError";
    }
  }, R = (r) => {
    throw new Be(r);
  };
  function De(r, e) {
    let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var n = e.name;
    if (r || R(`type "${n}" must have a positive integer typeid pointer`), B.hasOwnProperty(r)) {
      if (t.ignoreDuplicateRegistrations)
        return;
      R(`Cannot register type '${n}' twice`);
    }
    if (B[r] = e, delete er[r], j.hasOwnProperty(r)) {
      var i = j[r];
      delete j[r], i.forEach((a) => a());
    }
  }
  function S(r, e) {
    let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return De(r, e, t);
  }
  var Ue = (r, e, t, n) => {
    e = T(e), S(r, {
      name: e,
      fromWireType: function(i) {
        return !!i;
      },
      toWireType: function(i, a) {
        return a ? t : n;
      },
      readValueFromPointer: function(i) {
        return this.fromWireType(E[i]);
      },
      destructorFunction: null
    });
  }, Dr = [], D = [0, 1, , 1, null, 1, !0, 1, !1, 1], vr = (r) => {
    r > 9 && --D[r + 1] === 0 && (D[r] = void 0, Dr.push(r));
  }, M = {
    toValue: (r) => (r || R(`Cannot use deleted val. handle = ${r}`), D[r]),
    toHandle: (r) => {
      switch (r) {
        case void 0:
          return 2;
        case null:
          return 4;
        case !0:
          return 6;
        case !1:
          return 8;
        default: {
          const e = Dr.pop() || D.length;
          return D[e] = r, D[e + 1] = 1, e;
        }
      }
    }
  }, Ie = {
    name: "emscripten::val",
    fromWireType: (r) => {
      var e = M.toValue(r);
      return vr(r), e;
    },
    toWireType: (r, e) => M.toHandle(e),
    readValueFromPointer: rr,
    destructorFunction: null
  }, $e = (r) => S(r, Ie), Ve = (r, e) => {
    switch (e) {
      case 4:
        return function(t) {
          return this.fromWireType(Ar[t >> 2]);
        };
      case 8:
        return function(t) {
          return this.fromWireType(Rr[t >> 3]);
        };
      default:
        throw new TypeError(`invalid float width (${e}): ${r}`);
    }
  }, je = (r, e, t) => {
    e = T(e), S(r, {
      name: e,
      fromWireType: (n) => n,
      toWireType: (n, i) => i,
      readValueFromPointer: Ve(e, t),
      destructorFunction: null
    });
  }, Ur = (r, e) => Object.defineProperty(e, "name", {
    value: r
  });
  function Ne(r) {
    for (var e = 1; e < r.length; ++e)
      if (r[e] !== null && r[e].destructorFunction === void 0)
        return !0;
    return !1;
  }
  function He(r, e, t, n, i, a) {
    var o = e.length;
    o < 2 && R("argTypes array size mismatch! Must at least get return value and 'this' types!"), e[1];
    var s = Ne(e), u = !e[0].isVoid, f = o - 2, c = new Array(f), l = [], y = [], b = function() {
      y.length = 0;
      var k;
      l.length = 1, l[0] = i;
      for (var m = 0; m < f; ++m)
        c[m] = e[m + 2].toWireType(y, m < 0 || arguments.length <= m ? void 0 : arguments[m]), l.push(c[m]);
      var A = n(...l);
      function w(dr) {
        if (s)
          fr(y);
        else
          for (var O = 2; O < e.length; O++) {
            var dn = O === 1 ? k : c[O - 2];
            e[O].destructorFunction !== null && e[O].destructorFunction(dn);
          }
        if (u)
          return e[0].fromWireType(dr);
      }
      return w(A);
    };
    return Ur(r, b);
  }
  var Le = (r, e, t) => {
    if (r[e].overloadTable === void 0) {
      var n = r[e];
      r[e] = function() {
        for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++)
          a[o] = arguments[o];
        return r[e].overloadTable.hasOwnProperty(a.length) || R(`Function '${t}' called with an invalid number of arguments (${a.length}) - expects one of (${r[e].overloadTable})!`), r[e].overloadTable[a.length].apply(this, a);
      }, r[e].overloadTable = [], r[e].overloadTable[n.argCount] = n;
    }
  }, xe = (r, e, t) => {
    v.hasOwnProperty(r) ? ((t === void 0 || v[r].overloadTable !== void 0 && v[r].overloadTable[t] !== void 0) && R(`Cannot register public name '${r}' twice`), Le(v, r, r), v[r].overloadTable.hasOwnProperty(t) && R(`Cannot register multiple overloads of a function with the same number of arguments (${t})!`), v[r].overloadTable[t] = e) : (v[r] = e, v[r].argCount = t);
  }, Xe = (r, e) => {
    for (var t = [], n = 0; n < r; n++)
      t.push(_[e + n * 4 >> 2]);
    return t;
  }, Ze = (r, e, t) => {
    v.hasOwnProperty(r) || Wr("Replacing nonexistent public symbol"), v[r].overloadTable !== void 0 && t !== void 0 ? v[r].overloadTable[t] = e : (v[r] = e, v[r].argCount = t);
  }, U = {}, ze = (r, e, t) => {
    r = r.replace(/p/g, "i");
    var n = U[r];
    return n(e, ...t);
  }, Ir = [], h = (r) => {
    var e = Ir[r];
    return e || (Ir[r] = e = Kr.get(r)), e;
  }, Ge = function(r, e) {
    let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    if (r.includes("j"))
      return ze(r, e, t);
    var n = h(e), i = n(...t);
    function a(o) {
      return o;
    }
    return i;
  }, qe = function(r, e) {
    let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    return function() {
      for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++)
        i[a] = arguments[a];
      return Ge(r, e, i, t);
    };
  }, Z = function(r, e) {
    r = T(r);
    function t() {
      if (r.includes("j"))
        return qe(r, e);
      var i = h(e);
      return i;
    }
    var n = t();
    return typeof n != "function" && R(`unknown function pointer with signature ${r}: ${e}`), n;
  };
  class Ye extends Error {
  }
  var $r = (r) => {
    var e = Hr(r), t = T(e);
    return P(e), t;
  }, Ke = (r, e) => {
    var t = [], n = {};
    function i(a) {
      if (!n[a] && !B[a]) {
        if (er[a]) {
          er[a].forEach(i);
          return;
        }
        t.push(a), n[a] = !0;
      }
    }
    throw e.forEach(i), new Ye(`${r}: ` + t.map($r).join([", "]));
  }, Je = (r) => {
    r = r.trim();
    const e = r.indexOf("(");
    return e === -1 ? r : r.slice(0, e);
  }, Qe = (r, e, t, n, i, a, o, s) => {
    var u = Xe(e, t);
    r = T(r), r = Je(r), i = Z(n, i), xe(r, function() {
      Ke(`Cannot call ${r} due to unbound types`, u);
    }, e - 1), Br([], u, (f) => {
      var c = [f[0], null].concat(f.slice(1));
      return Ze(r, He(r, c, null, i, a), e - 1), [];
    });
  }, rt = (r, e, t) => {
    switch (e) {
      case 1:
        return t ? (n) => W[n] : (n) => E[n];
      case 2:
        return t ? (n) => q[n >> 1] : (n) => x[n >> 1];
      case 4:
        return t ? (n) => X[n >> 2] : (n) => _[n >> 2];
      default:
        throw new TypeError(`invalid integer width (${e}): ${r}`);
    }
  }, et = (r, e, t, n, i) => {
    e = T(e);
    const a = n === 0;
    let o = (u) => u;
    if (a) {
      var s = 32 - 8 * t;
      o = (u) => u << s >>> s, i = o(i);
    }
    S(r, {
      name: e,
      fromWireType: o,
      toWireType: (u, f) => f,
      readValueFromPointer: rt(e, t, n !== 0),
      destructorFunction: null
    });
  }, tt = (r, e, t) => {
    var n = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], i = n[e];
    function a(o) {
      var s = _[o >> 2], u = _[o + 4 >> 2];
      return new i(W.buffer, u, s);
    }
    t = T(t), S(r, {
      name: t,
      fromWireType: a,
      readValueFromPointer: a
    }, {
      ignoreDuplicateRegistrations: !0
    });
  }, nt = (r, e, t, n) => {
    if (!(n > 0)) return 0;
    for (var i = t, a = t + n - 1, o = 0; o < r.length; ++o) {
      var s = r.codePointAt(o);
      if (s <= 127) {
        if (t >= a) break;
        e[t++] = s;
      } else if (s <= 2047) {
        if (t + 1 >= a) break;
        e[t++] = 192 | s >> 6, e[t++] = 128 | s & 63;
      } else if (s <= 65535) {
        if (t + 2 >= a) break;
        e[t++] = 224 | s >> 12, e[t++] = 128 | s >> 6 & 63, e[t++] = 128 | s & 63;
      } else {
        if (t + 3 >= a) break;
        e[t++] = 240 | s >> 18, e[t++] = 128 | s >> 12 & 63, e[t++] = 128 | s >> 6 & 63, e[t++] = 128 | s & 63, o++;
      }
    }
    return e[t] = 0, t - i;
  }, N = (r, e, t) => nt(r, E, e, t), Vr = (r) => {
    for (var e = 0, t = 0; t < r.length; ++t) {
      var n = r.charCodeAt(t);
      n <= 127 ? e++ : n <= 2047 ? e += 2 : n >= 55296 && n <= 57343 ? (e += 4, ++t) : e += 3;
    }
    return e;
  }, it = (r, e) => {
    e = T(e), S(r, {
      name: e,
      fromWireType(t) {
        var n = _[t >> 2], i = t + 4, a;
        return a = Re(i, n, !0), P(t), a;
      },
      toWireType(t, n) {
        n instanceof ArrayBuffer && (n = new Uint8Array(n));
        var i, a = typeof n == "string";
        a || ArrayBuffer.isView(n) && n.BYTES_PER_ELEMENT == 1 || R("Cannot pass non-string to std::string"), a ? i = Vr(n) : i = n.length;
        var o = _r(4 + i + 1), s = o + 4;
        return _[o >> 2] = i, a ? N(n, s, i + 1) : E.set(n, s), t !== null && t.push(P, o), o;
      },
      readValueFromPointer: rr,
      destructorFunction(t) {
        P(t);
      }
    });
  }, jr = globalThis.TextDecoder ? new TextDecoder("utf-16le") : void 0, at = (r, e, t) => {
    var n = r >> 1, i = Or(x, n, e / 2, t);
    if (i - n > 16 && jr) return jr.decode(x.subarray(n, i));
    for (var a = "", o = n; o < i; ++o) {
      var s = x[o];
      a += String.fromCharCode(s);
    }
    return a;
  }, ot = (r, e, t) => {
    if (t != null || (t = 2147483647), t < 2) return 0;
    t -= 2;
    for (var n = e, i = t < r.length * 2 ? t / 2 : r.length, a = 0; a < i; ++a) {
      var o = r.charCodeAt(a);
      q[e >> 1] = o, e += 2;
    }
    return q[e >> 1] = 0, e - n;
  }, st = (r) => r.length * 2, ut = (r, e, t) => {
    for (var n = "", i = r >> 2, a = 0; !(a >= e / 4); a++) {
      var o = _[i + a];
      if (!o && !t) break;
      n += String.fromCodePoint(o);
    }
    return n;
  }, ft = (r, e, t) => {
    if (t != null || (t = 2147483647), t < 4) return 0;
    for (var n = e, i = n + t - 4, a = 0; a < r.length; ++a) {
      var o = r.codePointAt(a);
      if (o > 65535 && a++, X[e >> 2] = o, e += 4, e + 4 > i) break;
    }
    return X[e >> 2] = 0, e - n;
  }, vt = (r) => {
    for (var e = 0, t = 0; t < r.length; ++t) {
      var n = r.codePointAt(t);
      n > 65535 && t++, e += 4;
    }
    return e;
  }, ct = (r, e, t) => {
    t = T(t);
    var n, i, a;
    e === 2 ? (n = at, i = ot, a = st) : (n = ut, i = ft, a = vt), S(r, {
      name: t,
      fromWireType: (o) => {
        var s = _[o >> 2], u = n(o + 4, s * e, !0);
        return P(o), u;
      },
      toWireType: (o, s) => {
        typeof s != "string" && R(`Cannot pass non-string to C++ string type ${t}`);
        var u = a(s), f = _r(4 + u + e);
        return _[f >> 2] = u / e, i(s, f + 4, u + e), o !== null && o.push(P, f), f;
      },
      readValueFromPointer: rr,
      destructorFunction(o) {
        P(o);
      }
    });
  }, lt = (r, e, t, n, i, a) => {
    Q[r] = {
      name: T(e),
      rawConstructor: Z(t, n),
      rawDestructor: Z(i, a),
      fields: []
    };
  }, _t = (r, e, t, n, i, a, o, s, u, f) => {
    Q[r].fields.push({
      fieldName: T(e),
      getterReturnType: t,
      getter: Z(n, i),
      getterContext: a,
      setterArgumentType: o,
      setter: Z(s, u),
      setterContext: f
    });
  }, dt = (r, e) => {
    e = T(e), S(r, {
      isVoid: !0,
      name: e,
      fromWireType: () => {
      },
      toWireType: (t, n) => {
      }
    });
  }, cr = [], ht = (r) => {
    var e = cr.length;
    return cr.push(r), e;
  }, gt = (r, e) => {
    var t = B[r];
    return t === void 0 && R(`${e} has unknown type ${$r(r)}`), t;
  }, pt = (r, e) => {
    for (var t = new Array(r), n = 0; n < r; ++n)
      t[n] = gt(_[e + n * 4 >> 2], `parameter ${n}`);
    return t;
  }, yt = (r, e, t) => {
    var n = [], i = r(n, t);
    return n.length && (_[e >> 2] = M.toHandle(n)), i;
  }, mt = {}, Nr = (r) => {
    var e = mt[r];
    return e === void 0 ? T(r) : e;
  }, wt = (r, e, t) => {
    var n = 8, [i, ...a] = pt(r, e), o = i.toWireType.bind(i), s = a.map((l) => l.readValueFromPointer.bind(l));
    r--;
    var u = new Array(r), f = (l, y, b, k) => {
      for (var m = 0, A = 0; A < r; ++A)
        u[A] = s[A](k + m), m += n;
      var w;
      switch (t) {
        case 0:
          w = M.toValue(l).apply(null, u);
          break;
        case 2:
          w = Reflect.construct(M.toValue(l), u);
          break;
        case 3:
          w = u[0];
          break;
        case 1:
          w = M.toValue(l)[Nr(y)](...u);
          break;
      }
      return yt(o, b, w);
    }, c = `methodCaller<(${a.map((l) => l.name)}) => ${i.name}>`;
    return ht(Ur(c, f));
  }, bt = (r) => r ? (r = Nr(r), M.toHandle(globalThis[r])) : M.toHandle(globalThis), Tt = (r) => {
    r > 9 && (D[r + 1] += 1);
  }, At = (r, e, t, n, i) => cr[r](e, t, n, i), Rt = (r) => {
    var e = M.toValue(r);
    fr(e), vr(r);
  }, Ft = (r, e, t, n) => {
    var i = (/* @__PURE__ */ new Date()).getFullYear(), a = new Date(i, 0, 1), o = new Date(i, 6, 1), s = a.getTimezoneOffset(), u = o.getTimezoneOffset(), f = Math.max(s, u);
    _[r >> 2] = f * 60, X[e >> 2] = +(s != u);
    var c = (b) => {
      var k = b >= 0 ? "-" : "+", m = Math.abs(b), A = String(Math.floor(m / 60)).padStart(2, "0"), w = String(m % 60).padStart(2, "0");
      return `UTC${k}${A}${w}`;
    }, l = c(s), y = c(u);
    u < s ? (N(l, t, 17), N(y, n, 17)) : (N(l, n, 17), N(y, t, 17));
  }, Et = () => 2147483648, Ct = (r, e) => Math.ceil(r / e) * e, St = (r) => {
    var e = tr.buffer.byteLength, t = (r - e + 65535) / 65536 | 0;
    try {
      return tr.grow(t), Er(), 1;
    } catch {
    }
  }, Mt = (r) => {
    var e = E.length;
    r >>>= 0;
    var t = Et();
    if (r > t)
      return !1;
    for (var n = 1; n <= 4; n *= 2) {
      var i = e * (1 + 0.2 / n);
      i = Math.min(i, r + 100663296);
      var a = Math.min(t, Ct(Math.max(r, i), 65536)), o = St(a);
      if (o)
        return !0;
    }
    return !1;
  }, lr = {}, kt = () => pr || "./this.program", z = () => {
    if (!z.strings) {
      var r = (typeof navigator == "object" && navigator.language || "C").replace("-", "_") + ".UTF-8", e = {
        USER: "web_user",
        LOGNAME: "web_user",
        PATH: "/",
        PWD: "/",
        HOME: "/home/web_user",
        LANG: r,
        _: kt()
      };
      for (var t in lr)
        lr[t] === void 0 ? delete e[t] : e[t] = lr[t];
      var n = [];
      for (var t in e)
        n.push(`${t}=${e[t]}`);
      z.strings = n;
    }
    return z.strings;
  }, Ot = (r, e) => {
    var t = 0, n = 0;
    for (var i of z()) {
      var a = e + t;
      _[r + n >> 2] = a, t += N(i, a, 1 / 0) + 1, n += 4;
    }
    return 0;
  }, Pt = (r, e) => {
    var t = z();
    _[r >> 2] = t.length;
    var n = 0;
    for (var i of t)
      n += Vr(i) + 1;
    return _[e >> 2] = n, 0;
  }, Wt = (r) => 52, Bt = (r, e, t, n) => 52;
  function Dt(r, e, t, n, i) {
    return 70;
  }
  var Ut = [null, [], []], It = (r, e) => {
    var t = Ut[r];
    e === 0 || e === 10 ? ((r === 1 ? mr : $)(Pr(t)), t.length = 0) : t.push(e);
  }, $t = (r, e, t, n) => {
    for (var i = 0, a = 0; a < t; a++) {
      var o = _[e >> 2], s = _[e + 4 >> 2];
      e += 8;
      for (var u = 0; u < s; u++)
        It(r, E[o + u]);
      i += s;
    }
    return _[n >> 2] = i, 0;
  }, Vt = (r) => r;
  if (v.noExitRuntime && v.noExitRuntime, v.print && (mr = v.print), v.printErr && ($ = v.printErr), v.wasmBinary && (L = v.wasmBinary), v.arguments && v.arguments, v.thisProgram && (pr = v.thisProgram), v.preInit)
    for (typeof v.preInit == "function" && (v.preInit = [v.preInit]); v.preInit.length > 0; )
      v.preInit.shift()();
  var Hr, _r, P, d, Lr, xr, Xr, Zr, zr, Gr, qr, Yr, tr, Kr;
  function jt(r) {
    Hr = r.pa, _r = v._malloc = r.ra, P = v._free = r.sa, d = r.ta, Lr = r.ua, xr = r.va, Xr = r.wa, Zr = r.xa, zr = r.ya, Gr = r.za, qr = r.Aa, U.jiji = r.Ba, U.viijii = r.Ca, Yr = U.jiiii = r.Da, U.iiiiij = r.Ea, U.iiiiijj = r.Fa, U.iiiiiijj = r.Ga, tr = r.na, Kr = r.qa;
  }
  var Nt = {
    t: he,
    w: ge,
    a: pe,
    g: ye,
    n: me,
    _: we,
    r: be,
    Z: Te,
    d: Ae,
    L: Fe,
    da: Ee,
    ba: Ce,
    ea: Se,
    aa: Me,
    U: ke,
    ka: Pe,
    T: We,
    ia: Ue,
    ga: $e,
    M: je,
    N: Qe,
    u: et,
    o: tt,
    ha: it,
    E: ct,
    G: lt,
    la: _t,
    ja: dt,
    D: wt,
    ma: vr,
    Q: bt,
    F: Tt,
    B: At,
    Y: Rt,
    V: Ft,
    $: Mt,
    W: Ot,
    X: Pt,
    J: Wt,
    ca: Bt,
    S: Dt,
    K: $t,
    H: un,
    P: Gt,
    I: sn,
    m: fn,
    b: Zt,
    e: qt,
    f: zt,
    j: rn,
    v: tn,
    s: an,
    C: on,
    y: vn,
    R: ln,
    k: Yt,
    i: Ht,
    c: xt,
    h: Xt,
    p: Lt,
    z: nn,
    A: Jt,
    q: en,
    fa: Qt,
    l: Kt,
    x: cn,
    O: Vt
  };
  function Ht(r, e) {
    var t = p();
    try {
      h(r)(e);
    } catch (n) {
      if (g(t), n !== n + 0) throw n;
      d(1, 0);
    }
  }
  function Lt(r, e, t, n, i) {
    var a = p();
    try {
      h(r)(e, t, n, i);
    } catch (o) {
      if (g(a), o !== o + 0) throw o;
      d(1, 0);
    }
  }
  function xt(r, e, t) {
    var n = p();
    try {
      h(r)(e, t);
    } catch (i) {
      if (g(n), i !== i + 0) throw i;
      d(1, 0);
    }
  }
  function Xt(r, e, t, n) {
    var i = p();
    try {
      h(r)(e, t, n);
    } catch (a) {
      if (g(i), a !== a + 0) throw a;
      d(1, 0);
    }
  }
  function Zt(r, e) {
    var t = p();
    try {
      return h(r)(e);
    } catch (n) {
      if (g(t), n !== n + 0) throw n;
      d(1, 0);
    }
  }
  function zt(r, e, t, n) {
    var i = p();
    try {
      return h(r)(e, t, n);
    } catch (a) {
      if (g(i), a !== a + 0) throw a;
      d(1, 0);
    }
  }
  function Gt(r, e, t, n, i, a) {
    var o = p();
    try {
      return h(r)(e, t, n, i, a);
    } catch (s) {
      if (g(o), s !== s + 0) throw s;
      d(1, 0);
    }
  }
  function qt(r, e, t) {
    var n = p();
    try {
      return h(r)(e, t);
    } catch (i) {
      if (g(n), i !== i + 0) throw i;
      d(1, 0);
    }
  }
  function Yt(r) {
    var e = p();
    try {
      h(r)();
    } catch (t) {
      if (g(e), t !== t + 0) throw t;
      d(1, 0);
    }
  }
  function Kt(r, e, t, n, i, a, o, s, u, f, c) {
    var l = p();
    try {
      h(r)(e, t, n, i, a, o, s, u, f, c);
    } catch (y) {
      if (g(l), y !== y + 0) throw y;
      d(1, 0);
    }
  }
  function Jt(r, e, t, n, i, a, o) {
    var s = p();
    try {
      h(r)(e, t, n, i, a, o);
    } catch (u) {
      if (g(s), u !== u + 0) throw u;
      d(1, 0);
    }
  }
  function Qt(r, e, t, n, i, a, o, s, u) {
    var f = p();
    try {
      h(r)(e, t, n, i, a, o, s, u);
    } catch (c) {
      if (g(f), c !== c + 0) throw c;
      d(1, 0);
    }
  }
  function rn(r, e, t, n, i) {
    var a = p();
    try {
      return h(r)(e, t, n, i);
    } catch (o) {
      if (g(a), o !== o + 0) throw o;
      d(1, 0);
    }
  }
  function en(r, e, t, n, i, a, o, s) {
    var u = p();
    try {
      h(r)(e, t, n, i, a, o, s);
    } catch (f) {
      if (g(u), f !== f + 0) throw f;
      d(1, 0);
    }
  }
  function tn(r, e, t, n, i, a) {
    var o = p();
    try {
      return h(r)(e, t, n, i, a);
    } catch (s) {
      if (g(o), s !== s + 0) throw s;
      d(1, 0);
    }
  }
  function nn(r, e, t, n, i, a) {
    var o = p();
    try {
      h(r)(e, t, n, i, a);
    } catch (s) {
      if (g(o), s !== s + 0) throw s;
      d(1, 0);
    }
  }
  function an(r, e, t, n, i, a, o) {
    var s = p();
    try {
      return h(r)(e, t, n, i, a, o);
    } catch (u) {
      if (g(s), u !== u + 0) throw u;
      d(1, 0);
    }
  }
  function on(r, e, t, n, i, a, o, s) {
    var u = p();
    try {
      return h(r)(e, t, n, i, a, o, s);
    } catch (f) {
      if (g(u), f !== f + 0) throw f;
      d(1, 0);
    }
  }
  function sn(r, e, t, n) {
    var i = p();
    try {
      return h(r)(e, t, n);
    } catch (a) {
      if (g(i), a !== a + 0) throw a;
      d(1, 0);
    }
  }
  function un(r, e, t, n) {
    var i = p();
    try {
      return h(r)(e, t, n);
    } catch (a) {
      if (g(i), a !== a + 0) throw a;
      d(1, 0);
    }
  }
  function fn(r) {
    var e = p();
    try {
      return h(r)();
    } catch (t) {
      if (g(e), t !== t + 0) throw t;
      d(1, 0);
    }
  }
  function vn(r, e, t, n, i, a, o, s, u, f, c, l) {
    var y = p();
    try {
      return h(r)(e, t, n, i, a, o, s, u, f, c, l);
    } catch (b) {
      if (g(y), b !== b + 0) throw b;
      d(1, 0);
    }
  }
  function cn(r, e, t, n, i, a, o, s, u, f, c, l, y, b, k, m) {
    var A = p();
    try {
      h(r)(e, t, n, i, a, o, s, u, f, c, l, y, b, k, m);
    } catch (w) {
      if (g(A), w !== w + 0) throw w;
      d(1, 0);
    }
  }
  function ln(r, e, t, n, i) {
    var a = p();
    try {
      return Yr(r, e, t, n, i);
    } catch (o) {
      if (g(a), o !== o + 0) throw o;
      d(1, 0);
    }
  }
  function _n() {
    ne();
    function r() {
      var e, t;
      v.calledRun = !0, !wr && (ie(), (e = br) === null || e === void 0 || e(v), (t = v.onRuntimeInitialized) === null || t === void 0 || t.call(v), ae());
    }
    v.setStatus ? (v.setStatus("Running..."), setTimeout(() => {
      setTimeout(() => v.setStatus(""), 1), r();
    }, 1)) : r();
  }
  var G;
  return G = await le(), _n(), Fr ? H = v : H = new Promise((r, e) => {
    br = r, Tr = e;
  }), H;
}
function Jr(F) {
  return hn(hr, F);
}
function bn() {
  return gn(hr);
}
function Tn(F) {
  return Jr({
    overrides: F,
    equalityFn: Object.is,
    fireImmediately: !0
  });
}
function An(F) {
  Jr({
    overrides: F,
    equalityFn: Object.is,
    fireImmediately: !1
  });
}
async function Rn(F, H) {
  return pn(hr, F, H);
}
const Fn = "025615f44e710f9f8577a015a6a470e47d5b9ef1d34ffd5092055a6bd4d6d449";
export {
  Sn as BARCODE_FORMATS,
  Mn as BARCODE_HRI_LABELS,
  kn as BARCODE_META_FORMATS,
  On as BARCODE_SYMBOLOGIES,
  Pn as CHARACTER_SETS,
  Wn as CREATABLE_BARCODE_FORMATS,
  Bn as GS1_BARCODE_FORMATS,
  Dn as INDUSTRIAL_BARCODE_FORMATS,
  Un as LINEAR_BARCODE_FORMATS,
  In as MATRIX_BARCODE_FORMATS,
  $n as READABLE_BARCODE_FORMATS,
  Vn as RETAIL_BARCODE_FORMATS,
  jn as ZXING_CPP_COMMIT,
  Fn as ZXING_WASM_SHA256,
  Nn as ZXING_WASM_VERSION,
  Hn as barcodeFormats,
  Ln as characterSets,
  xn as defaultWriterOptions,
  Xn as encodeFormat,
  Zn as encodeFormats,
  zn as formatToLabel,
  Gn as formatToSymbology,
  Tn as getZXingModule,
  qn as linearBarcodeFormats,
  Yn as matrixBarcodeFormats,
  Jr as prepareZXingModule,
  bn as purgeZXingModule,
  An as setZXingModuleOverrides,
  Kn as symbologyToFormats,
  Rn as writeBarcode
};
