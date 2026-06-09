class SaldoSimulation {
  constructor(startSaldo) {
    this.saldo = startSaldo;
  }
  applyIncomes(incomes) {
    incomes.forEach((income) => {
      this.saldo += income.getAmount();
    });
  }
  applyFixedExpenses(fixedExpenses) {
    fixedExpenses.forEach((expense) => {
      this.saldo -= expense.getAmount();
    });
  }
  applyVariableExpense(expense) {
    if (expense) {
      this.saldo -= expense.getAmount();
    }
  }
  getSaldo() {
    return this.saldo;
  }
  applyCustomExpense(amount) {
    if (typeof amount === "number") {
      this.saldo -= amount;
    }
  }
}
class Month {
  constructor(name) {
    this.name = name;
    this.incomes = [];
    this.fixedExpenses = [];
    this.variableExpenses = [];
    this.variableExpenseCounter = 0;
  }
  addIncome(income) {
    this.incomes.push(income);
  }
  addFixedExpense(expense) {
    this.fixedExpenses.push(expense);
  }
  addVariableExpense(expense) {
    this.variableExpenses.push(expense);
  }
  getIncomes(toeslagNaam = "", toeslagPercentage = 100) {
    return this.incomes;
  }
  getFixedExpenses() {
    return this.fixedExpenses;
  }
  getVariableExpenses() {
    return this.variableExpenses;
  }
  getNextVariableExpense(increment = true) {
    if (this.variableExpenseCounter >= this.variableExpenses.length) {
      return null;
    }
    const expense = this.variableExpenses[this.variableExpenseCounter];
    if (increment) {
      this.variableExpenseCounter++;
    }
    return expense;
  }
}
class Income {
  constructor(name, amount) {
    this.name = name;
    this.amount = parseInt(amount);
    this.percentage = 100;
  }
  getOriginalAmount() {
    return this.amount;
  }
  getAmount() {
    return Math.round(this.amount * (this.percentage / 100));
  }
  getName() {
    return this.name;
  }
  getPercentage() {
    return this.percentage;
  }
  setPercentage(percentage) {
    this.percentage = percentage;
  }
}
class Expense {
  constructor(name, description, amount) {
    this.name = name;
    this.description = description;
    this.amount = parseInt(amount);
  }
  getAmount() {
    return this.amount;
  }
  getName() {
    return this.name;
  }
  getDescription() {
    return this.description;
  }
}
const xml = {
  createDocument: function createDocument(content) {
    return new DOMParser().parseFromString(content.trim(), "text/xml");
  }
};
var ch2 = {};
var wk = function(c, id, msg, transfer, cb) {
  var w = new Worker(ch2[id] || (ch2[id] = URL.createObjectURL(new Blob([
    c + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
  ], { type: "text/javascript" }))));
  w.onmessage = function(e) {
    var d = e.data, ed = d.$e$;
    if (ed) {
      var err2 = new Error(ed[0]);
      err2["code"] = ed[1];
      err2.stack = ed[2];
      cb(err2, null);
    } else
      cb(null, d);
  };
  w.postMessage(msg, transfer);
  return w;
};
var u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  var r = new i32(b[30]);
  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2), fl = _a.b, revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b.b;
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
  var x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var hMap = function(cd, mb, r) {
  var s = cd.length;
  var i = 0;
  var l = new u16(mb);
  for (; i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v = le[cd[i] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
};
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
  flt[i] = 8;
for (var i = 144; i < 256; ++i)
  flt[i] = 9;
for (var i = 256; i < 280; ++i)
  flt[i] = 7;
for (var i = 280; i < 288; ++i)
  flt[i] = 8;
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
  fdt[i] = 5;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m)
      m = a[i];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i = 0; i < hcLen; ++i) {
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i = 0; i < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var mrg = function(a, b) {
  var o = {};
  for (var k in a)
    o[k] = a[k];
  for (var k in b)
    o[k] = b[k];
  return o;
};
var wcln = function(fn, fnStr, td2) {
  var dt = fn();
  var st = fn.toString();
  var ks = st.slice(st.indexOf("[") + 1, st.lastIndexOf("]")).replace(/\s+/g, "").split(",");
  for (var i = 0; i < dt.length; ++i) {
    var v = dt[i], k = ks[i];
    if (typeof v == "function") {
      fnStr += ";" + k + "=";
      var st_1 = v.toString();
      if (v.prototype) {
        if (st_1.indexOf("[native code]") != -1) {
          var spInd = st_1.indexOf(" ", 8) + 1;
          fnStr += st_1.slice(spInd, st_1.indexOf("(", spInd));
        } else {
          fnStr += st_1;
          for (var t in v.prototype)
            fnStr += ";" + k + ".prototype." + t + "=" + v.prototype[t].toString();
        }
      } else
        fnStr += st_1;
    } else
      td2[k] = v;
  }
  return fnStr;
};
var ch = [];
var cbfs = function(v) {
  var tl = [];
  for (var k in v) {
    if (v[k].buffer) {
      tl.push((v[k] = new v[k].constructor(v[k])).buffer);
    }
  }
  return tl;
};
var wrkr = function(fns, init, id, cb) {
  if (!ch[id]) {
    var fnStr = "", td_1 = {}, m = fns.length - 1;
    for (var i = 0; i < m; ++i)
      fnStr = wcln(fns[i], fnStr, td_1);
    ch[id] = { c: wcln(fns[m], fnStr, td_1), e: td_1 };
  }
  var td2 = mrg({}, ch[id].e);
  return wk(ch[id].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + init.toString() + "}", id, td2, cbfs(td2), cb);
};
var bInflt = function() {
  return [u8, u16, i32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, ec, hMap, max, bits, bits16, shft, slc, err, inflt, inflateSync, pbf, gopt];
};
var pbf = function(msg) {
  return postMessage(msg, [msg.buffer]);
};
var gopt = function(o) {
  return o && {
    out: o.size && new u8(o.size),
    dictionary: o.dictionary
  };
};
var cbify = function(dat, opts, fns, init, id, cb) {
  var w = wrkr(fns, init, id, function(err2, dat2) {
    w.terminate();
    cb(err2, dat2);
  });
  w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
  return function() {
    w.terminate();
  };
};
var b2 = function(d, b) {
  return d[b] | d[b + 1] << 8;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var b8 = function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
};
function inflate(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bInflt
  ], function(ev) {
    return pbf(inflateSync(ev.data[0], gopt(ev.data[1])));
  }, 1, cb);
}
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
var dutf8 = function(d) {
  for (var r = "", i = 0; ; ) {
    var c = d[i++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i + eb > d.length)
      return { s: r, r: slc(d, i - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
  }
};
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i = 0; i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
var slzh = function(d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
};
var zh = function(d, b, z) {
  var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
  var _a2 = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
  return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
};
var z64hs = function(d, b, l, z, sc, su, off) {
  var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
  var nf = nsc + nsu + noff;
  if (z && nf) {
    for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
      if (b2(d, b) == 1) {
        return [
          nsc ? b8(d, b + 4 + 8 * nsu) : sc,
          nsu ? b8(d, b + 4) : su,
          noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
          1
        ];
      }
    }
    if (z < 2)
      err(13);
  }
  return [sc, su, off, 0];
};
var mt = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(fn) {
  fn();
};
function unzip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  var term = [];
  var tAll = function() {
    for (var i2 = 0; i2 < term.length; ++i2)
      term[i2]();
  };
  var files = {};
  var cbd = function(a, b) {
    mt(function() {
      cb(a, b);
    });
  };
  mt(function() {
    cbd = cb;
  });
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558) {
      cbd(err(13, 0, 1), null);
      return tAll;
    }
  }
  var lft = b2(data, e + 8);
  if (lft) {
    var c = lft;
    var o = b4(data, e + 16);
    var z = b4(data, e - 20) == 117853008;
    if (z) {
      var ze = b4(data, e - 12);
      z = b4(data, ze) == 101075792;
      if (z) {
        c = lft = b4(data, ze + 32);
        o = b4(data, ze + 48);
      }
    }
    var fltr = opts && opts.filter;
    var _loop_3 = function(i2) {
      var _a2 = zh(data, o, z), c_1 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
      o = no;
      var cbl = function(e2, d) {
        if (e2) {
          tAll();
          cbd(e2, null);
        } else {
          if (d)
            files[fn] = d;
          if (!--lft)
            cbd(null, files);
        }
      };
      if (!fltr || fltr({
        name: fn,
        size: sc,
        originalSize: su,
        compression: c_1
      })) {
        if (!c_1)
          cbl(null, slc(data, b, b + sc));
        else if (c_1 == 8) {
          var infl = data.subarray(b, b + sc);
          if (su < 524288 || sc > 0.8 * su) {
            try {
              cbl(null, inflateSync(infl, { out: new u8(su) }));
            } catch (e2) {
              cbl(e2, null);
            }
          } else
            term.push(inflate(infl, { size: su }, cbl));
        } else
          cbl(err(14, "unknown compression type " + c_1, 1), null);
      } else
        cbl(null, null);
    };
    for (var i = 0; i < c; ++i) {
      _loop_3(i);
    }
  } else
    cbd(null, {});
  return tAll;
}
function unzipFromArrayBuffer(input, options) {
  return unzipFromArrayBufferUsingFunction(input, options, unzipAsync, true);
}
function unzipFromArrayBufferUsingFunction(input) {
  var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _filter = _ref.filter;
  var unzip2 = arguments.length > 2 ? arguments[2] : void 0;
  return unzip2(new Uint8Array(input), {
    // Ignore certain types of files.
    filter: function filter(file) {
      if (_filter) {
        return _filter({
          path: file.name
        });
      }
      return true;
    }
  });
}
function unzipAsync(archive) {
  return new Promise(function(resolve, reject) {
    unzip(archive, function(error, files) {
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });
}
function convertValuesFromUint8ArraysToStrings(entries) {
  var convertedEntries = {};
  for (var _i = 0, _Object$keys = Object.keys(entries); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    convertedEntries[key] = strFromU8(entries[key]);
  }
  return convertedEntries;
}
function filterZipArchiveEntry(_ref) {
  var path = _ref.path;
  return path.endsWith(".xml") || path.endsWith(".xml.rels");
}
function unpackXlsxFile(input) {
  if (input instanceof File || input instanceof Blob) {
    return input.arrayBuffer().then(getResultFromArrayBuffer);
  }
  return Promise.resolve(input).then(getResultFromArrayBuffer);
}
function getResultFromArrayBuffer(arrayBuffer) {
  return unzipFromArrayBuffer(arrayBuffer, {
    filter: filterZipArchiveEntry
  }).then(convertValuesFromUint8ArraysToStrings);
}
function findChild(node, tagName) {
  var i = 0;
  while (i < node.childNodes.length) {
    var childNode = node.childNodes[i];
    if (childNode.nodeType === 1 && getTagName(childNode) === tagName) {
      return childNode;
    }
    i++;
  }
}
function findChildren(node, tagName) {
  var results = [];
  var i = 0;
  while (i < node.childNodes.length) {
    var childNode = node.childNodes[i];
    if (childNode.nodeType === 1 && getTagName(childNode) === tagName) {
      results.push(childNode);
    }
    i++;
  }
  return results;
}
function forEach(node, tagName, func) {
  var i = 0;
  while (i < node.childNodes.length) {
    var childNode = node.childNodes[i];
    if (tagName) {
      if (childNode.nodeType === 1 && getTagName(childNode) === tagName) {
        func(childNode, i);
      }
    } else {
      func(childNode, i);
    }
    i++;
  }
}
function map(node, tagName, func) {
  var results = [];
  forEach(node, tagName, function(node2, i) {
    results.push(func(node2, i));
  });
  return results;
}
var NAMESPACE_REG_EXP = /.+\:/;
function getTagName(element) {
  return element.tagName.replace(NAMESPACE_REG_EXP, "");
}
function isElement(node) {
  return node.nodeType === 1;
}
function getFirstElementChild(element) {
  var i = 0;
  while (i < element.childNodes.length) {
    if (isElement(element.childNodes[i])) {
      return element.childNodes[i];
    }
    i++;
  }
}
function getOuterXml(node) {
  if (node.nodeType !== 1) {
    return node.textContent;
  }
  var xml2 = "<" + getTagName(node);
  var j = 0;
  while (j < node.attributes.length) {
    xml2 += " " + node.attributes[j].name + '="' + node.attributes[j].value + '"';
    j++;
  }
  xml2 += ">";
  var i = 0;
  while (i < node.childNodes.length) {
    xml2 += getOuterXml(node.childNodes[i]);
    i++;
  }
  xml2 += "</" + getTagName(node) + ">";
  return xml2;
}
function getCellElements(document2) {
  var worksheet = document2.documentElement;
  var sheetData = findChild(worksheet, "sheetData");
  var cells = [];
  forEach(sheetData, "row", function(row) {
    forEach(row, "c", function(cell) {
      cells.push(cell);
    });
  });
  return cells;
}
function getCellValueElement(document2, element) {
  return findChild(element, "v");
}
function getCellInlineStringValue(document2, element) {
  var firstElementChild = getFirstElementChild(element);
  if (firstElementChild && getTagName(firstElementChild) === "is") {
    var firstElementChildFirstElementChild = getFirstElementChild(firstElementChild);
    if (firstElementChildFirstElementChild && getTagName(firstElementChildFirstElementChild) === "t") {
      return firstElementChildFirstElementChild.textContent;
    }
  }
}
function getDimensions(document2) {
  var worksheet = document2.documentElement;
  var dimensions = findChild(worksheet, "dimension");
  if (dimensions) {
    return dimensions.getAttribute("ref");
  }
}
function getBaseStyles(document2) {
  var styleSheet = document2.documentElement;
  var cellStyleXfs = findChild(styleSheet, "cellStyleXfs");
  if (cellStyleXfs) {
    return findChildren(cellStyleXfs, "xf");
  }
  return [];
}
function getCellStyles(document2) {
  var styleSheet = document2.documentElement;
  var cellXfs = findChild(styleSheet, "cellXfs");
  if (!cellXfs) {
    return [];
  }
  return findChildren(cellXfs, "xf");
}
function getNumberFormats(document2) {
  var styleSheet = document2.documentElement;
  var numFmts = findChild(styleSheet, "numFmts");
  if (numFmts) {
    return findChildren(numFmts, "numFmt");
  }
  return [];
}
function getSharedStrings(document2) {
  var sst = document2.documentElement;
  return map(sst, "si", function(string) {
    var t = findChild(string, "t");
    if (t) {
      return t.textContent;
    }
    var value = "";
    forEach(string, "r", function(r) {
      value += findChild(r, "t").textContent;
    });
    return value;
  });
}
function getWorkbookProperties(document2) {
  var workbook = document2.documentElement;
  return findChild(workbook, "workbookPr");
}
function getRelationships(document2) {
  var relationships = document2.documentElement;
  return findChildren(relationships, "Relationship");
}
function getSheets(document2) {
  var workbook = document2.documentElement;
  var sheets = findChild(workbook, "sheets");
  return findChildren(sheets, "sheet");
}
function _createForOfIteratorHelperLoose$5(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray$7(o)) || allowArrayLike) {
    if (it) o = it;
    var i = 0;
    return function() {
      if (i >= o.length) return { done: true };
      return { done: false, value: o[i++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$7(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$7(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$7(o, minLen);
}
function _arrayLikeToArray$7(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function parseSpreadsheetInfo(content, xml2) {
  var book = xml2.createDocument(content);
  var workbookProperties = getWorkbookProperties(book);
  var epoch1904 = Boolean(workbookProperties) && workbookProperties.getAttribute("date1904") === "1";
  var sheets = [];
  for (var _iterator = _createForOfIteratorHelperLoose$5(getSheets(book)), _step; !(_step = _iterator()).done; ) {
    var sheet = _step.value;
    if (sheet.getAttribute("name")) {
      sheets.push({
        id: sheet.getAttribute("sheetId"),
        name: sheet.getAttribute("name"),
        relationId: sheet.getAttribute("r:id")
      });
    }
  }
  return {
    epoch1904,
    sheets
  };
}
function parseFilePaths(content, xml2) {
  var document2 = xml2.createDocument(content);
  var filePaths = {
    sheets: {},
    sharedStrings: void 0,
    styles: void 0
  };
  var addFilePathInfo = function addFilePathInfo2(relationship) {
    var filePath = relationship.getAttribute("Target");
    var fileType = relationship.getAttribute("Type");
    switch (fileType) {
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles":
        filePaths.styles = getFilePath(filePath);
        break;
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings":
        filePaths.sharedStrings = getFilePath(filePath);
        break;
      case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet":
        filePaths.sheets[relationship.getAttribute("Id")] = getFilePath(filePath);
        break;
    }
  };
  getRelationships(document2).forEach(addFilePathInfo);
  return filePaths;
}
function getFilePath(path) {
  if (path[0] === "/") {
    return path.slice("/".length);
  }
  return "xl/" + path;
}
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint);
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function parseStyles(content, xml2) {
  if (!content) {
    return {};
  }
  var doc = xml2.createDocument(content);
  var baseStyles = getBaseStyles(doc).map(parseCellStyle);
  var numberFormats = getNumberFormats(doc).map(parseNumberFormatStyle).reduce(function(formats, format) {
    formats[format.id] = format;
    return formats;
  }, []);
  var getCellStyle = function getCellStyle2(xf) {
    if (xf.hasAttribute("xfId")) {
      return _objectSpread(_objectSpread({}, baseStyles[xf.xfId]), parseCellStyle(xf, numberFormats));
    }
    return parseCellStyle(xf, numberFormats);
  };
  return getCellStyles(doc).map(getCellStyle);
}
function parseNumberFormatStyle(numFmt) {
  return {
    id: numFmt.getAttribute("numFmtId"),
    template: numFmt.getAttribute("formatCode")
  };
}
function parseCellStyle(xf, numFmts) {
  var style = {};
  if (xf.hasAttribute("numFmtId")) {
    var numberFormatId = xf.getAttribute("numFmtId");
    if (numFmts[numberFormatId]) {
      style.numberFormat = numFmts[numberFormatId];
    } else {
      style.numberFormat = {
        id: numberFormatId
      };
    }
  }
  return style;
}
function parseSharedStrings(content, xml2) {
  if (!content) {
    return [];
  }
  return getSharedStrings(xml2.createDocument(content));
}
function parseExcelDate(excelSerialDate, options) {
  if (options && options.epoch1904) {
    excelSerialDate += (1904 - 1900) * DAYS_IN_YEAR + JANUARY_0TH_1900_DAY + ERRONEOUS_FEBRUARY_29_1990_DAY;
  }
  var daysBeforeUnixEpoch = JANUARY_0TH_1900_DAY + ERRONEOUS_FEBRUARY_29_1990_DAY + (1970 - 1900) * DAYS_IN_YEAR + NUMBER_OF_LEAP_YEARS_BETWEEN_1900_AND_1970;
  return new Date(Math.floor((excelSerialDate - daysBeforeUnixEpoch) * DAY));
}
var NUMBER_OF_LEAP_YEARS_BETWEEN_1900_AND_1970 = 17;
var JANUARY_0TH_1900_DAY = 1;
var ERRONEOUS_FEBRUARY_29_1990_DAY = 1;
var DAY = 24 * 60 * 60 * 1e3;
var DAYS_IN_YEAR = 365;
function _createForOfIteratorHelperLoose$4(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray$6(o)) || allowArrayLike) {
    if (it) o = it;
    var i = 0;
    return function() {
      if (i >= o.length) return { done: true };
      return { done: false, value: o[i++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$6(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$6(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$6(o, minLen);
}
function _arrayLikeToArray$6(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
var DATE_FORMAT_SPECIFIC_LOCALE_PREFIX = /^\[\$-[^\]]+\]/;
var DATE_FORMAT_ALLOW_ANY_OTHER_TEXT_SUFFIX = /;@$/;
var CACHE = {};
function isDateFormatCached(template) {
  if (template in CACHE) {
    return CACHE[template];
  }
  var result = isDateFormat(template);
  CACHE[template] = result;
  return result;
}
function isDateFormat(template) {
  template = template.toLowerCase();
  template = template.replace(DATE_FORMAT_SPECIFIC_LOCALE_PREFIX, "");
  template = template.replace(DATE_FORMAT_ALLOW_ANY_OTHER_TEXT_SUFFIX, "");
  var tokens = template.split(/\W+/);
  if (tokens.length < 0) {
    return false;
  }
  for (var _iterator = _createForOfIteratorHelperLoose$4(tokens), _step; !(_step = _iterator()).done; ) {
    var token = _step.value;
    if (DATE_TEMPLATE_TOKENS.indexOf(token) < 0) {
      return false;
    }
  }
  return true;
}
var DATE_TEMPLATE_TOKENS = [
  // Seconds (min two digits). Example: "05".
  "ss",
  // Minutes (min two digits). Example: "05". Could also be "Months". Weird.
  "mm",
  // Hours. Example: "1".
  "h",
  // Hours (min two digits). Example: "01".
  "hh",
  // "AM" part of "AM/PM". Lowercased just in case.
  "am",
  // "PM" part of "AM/PM". Lowercased just in case.
  "pm",
  // Day. Example: "1"
  "d",
  // Day (min two digits). Example: "01"
  "dd",
  // Month (numeric). Example: "1".
  "m",
  // Month (numeric, min two digits). Example: "01". Could also be "Minutes". Weird.
  "mm",
  // Month (shortened month name). Example: "Jan".
  "mmm",
  // Month (full month name). Example: "January".
  "mmmm",
  // Two-digit year. Example: "20".
  "yy",
  // Full year. Example: "2020".
  "yyyy",
  // I don't have any idea what "e" means.
  // It's used in "built-in" XLSX formats:
  // * 27 '[$-404]e/m/d';
  // * 36 '[$-404]e/m/d';
  // * 50 '[$-404]e/m/d';
  // * 57 '[$-404]e/m/d';
  "e"
];
function isDateFormatStyle(styleId, styles, options) {
  if (styleId) {
    var style = styles[styleId];
    if (!style) {
      throw new Error("Cell style not found: ".concat(styleId));
    }
    if (!style.numberFormat) {
      return false;
    }
    if (
      // Whether it's a "number format" that's conventionally used for storing date timestamps.
      BUILT_IN_DATE_FORMAT_IDS.indexOf(Number(style.numberFormat.id)) >= 0 || // Whether it's a "number format" that uses a "formatting template"
      // that the developer is certain is a date formatting template.
      options.dateFormat && style.numberFormat.template === options.dateFormat || // Whether the "smart formatting template" feature is not disabled
      // and it has detected that it's a date formatting template by looking at it.
      options.smartDateParser !== false && style.numberFormat.template && isDateFormatCached(style.numberFormat.template)
    ) {
      return true;
    }
  }
}
var LOCALE_INDEPENDENT_BUILT_IN_DATE_FORMAT_IDS = [
  14,
  // mm-dd-yy
  15,
  // d-mmm-yy
  16,
  // d-mmm
  17,
  // mmm-yy
  18,
  // h:mm AM/PM
  19,
  // h:mm:ss AM/PM
  20,
  // h:mm
  21,
  // h:mm:ss
  22,
  // m/d/yy h:mm
  45,
  // mm:ss
  46,
  // [h]:mm:ss
  47
  // mmss.0
];
var MAINLAND_CHINESE_OR_TAIWANESE_LOCALE_BUILT_IN_DATE_FORMAT_IDS = [
  27,
  // [$-404]e/m/d OR yyyy"年"m"月"
  28,
  // [$-404]e"年"m"月"d"日" OR m"月"d"日"
  29,
  // [$-404]e"年"m"月"d"日" OR m"月"d"日"
  30,
  // m/d/yy OR m-d-yy
  31,
  // yyyy"年"m"月"d"日" OR yyyy"年"m"月"d"日"
  32,
  // hh"時"mm"分" OR h"时"mm"分"
  33,
  // hh"時"mm"分"ss"秒" OR h"时"mm"分"ss"秒"
  34,
  // 上午/下午hh"時"mm"分" OR 上午/下午h"时"mm"分"
  35,
  // 上午/下午hh"時"mm"分"ss"秒" OR 上午/下午h"时"mm"分"ss"秒"
  36,
  // [$-404]e/m/d OR yyyy"年"m"月"
  50,
  // [$-404]e/m/d OR yyyy"年"m"月"
  51,
  // [$-404]e"年"m"月"d"日" OR m"月"d"日"
  52,
  // 上午/下午hh"時"mm"分" OR yyyy"年"m"月"
  53,
  // 上午/下午hh"時"mm"分"ss"秒" OR m"月"d"日"
  54,
  // [$-404]e"年"m"月"d"日" OR m"月"d"日"
  55,
  // 上午/下午hh"時"mm"分" OR 上午/下午h"时"mm"分"
  56,
  // 上午/下午hh"時"mm"分"ss"秒" OR 上午/下午h"时"mm"分"ss"秒"
  57,
  // [$-404]e/m/d OR yyyy"年"m"月"
  58
  // [$-404]e"年"m"月"d"日" OR m"月"d"日"
];
var JAPANESE_OR_KOREAN_LOCALE_BUILT_IN_DATE_FORMAT_IDS = [
  27,
  // [$-411]ge.m.d OR yyyy"年" mm"月" dd"日"
  28,
  // [$-411]ggge"年"m"月"d"日" OR mm-dd
  29,
  // [$-411]ggge"年"m"月"d"日" OR mm-dd
  30,
  // m/d/yy OR mm-dd-yy
  31,
  // yyyy"年"m"月"d"日" OR yyyy"년" mm"월" dd"일"
  32,
  // h"時"mm"分" OR h"시" mm"분"
  33,
  // h"時"mm"分"ss"秒" OR h"시" mm"분" ss"초"
  34,
  // yyyy"年"m"月" OR yyyy-mm-dd
  35,
  // m"月"d"日" OR yyyy-mm-dd
  36,
  // [$-411]ge.m.d OR yyyy"年" mm"月" dd"日"
  50,
  // [$-411]ge.m.d OR yyyy"年" mm"月" dd"日"
  51,
  // [$-411]ggge"年"m"月"d"日" OR mm-dd
  52,
  // yyyy"年"m"月" OR yyyy-mm-dd
  53,
  // m"月"d"日" OR yyyy-mm-dd
  54,
  // [$-411]ggge"年"m"月"d"日" OR mm-dd
  55,
  // yyyy"年"m"月" OR yyyy-mm-dd
  56,
  // m"月"d"日" OR yyyy-mm-dd
  57,
  // [$-411]ge.m.d OR yyyy"年" mm"月" dd"日"
  58
  // [$-411]ggge"年"m"月"d"日" OR mm-dd
];
var THAI_LOCALE_BUILT_IN_DATE_FORMAT_IDS = [
  71,
  // ว/ด/ปปปป
  72,
  // ว-ดดด-ปป
  73,
  // ว-ดดด
  74,
  // ดดด-ปป
  75,
  // ช:นน
  76,
  // ช:นน:ทท
  77,
  // ว/ด/ปปปป ช:นน
  78,
  // นน:ทท
  79,
  // [ช]:นน:ทท
  80,
  // นน:ทท.0
  81
  // d/m/bb
];
var BUILT_IN_DATE_FORMAT_IDS = LOCALE_INDEPENDENT_BUILT_IN_DATE_FORMAT_IDS.concat(
  // Add Mainland Chinese or Taiwanese date format IDs that haven't already been added.
  MAINLAND_CHINESE_OR_TAIWANESE_LOCALE_BUILT_IN_DATE_FORMAT_IDS
).concat(
  // Add Japanese or Korean date format IDs that haven't already been added.
  JAPANESE_OR_KOREAN_LOCALE_BUILT_IN_DATE_FORMAT_IDS.filter(function(numberFormatId) {
    return MAINLAND_CHINESE_OR_TAIWANESE_LOCALE_BUILT_IN_DATE_FORMAT_IDS.indexOf(numberFormatId) < 0;
  })
).concat(
  // Add Thai date format IDs that haven't already been added.
  THAI_LOCALE_BUILT_IN_DATE_FORMAT_IDS.filter(function(numberFormatId) {
    return MAINLAND_CHINESE_OR_TAIWANESE_LOCALE_BUILT_IN_DATE_FORMAT_IDS.indexOf(numberFormatId) < 0;
  }).filter(function(numberFormatId) {
    return JAPANESE_OR_KOREAN_LOCALE_BUILT_IN_DATE_FORMAT_IDS.indexOf(numberFormatId) < 0;
  })
);
function parseCellValue(value, type, _ref) {
  var getInlineStringValue = _ref.getInlineStringValue, getInlineStringXml = _ref.getInlineStringXml, getStyleId = _ref.getStyleId, styles = _ref.styles, sharedStrings = _ref.sharedStrings, epoch1904 = _ref.epoch1904, options = _ref.options;
  if (!type) {
    type = "n";
  }
  switch (type) {
    // XLSX tends to store all strings as "shared" (indexed) ones
    // using "s" cell type (for saving on strage space).
    // "str" cell type is then generally only used for storing
    // formula-pre-calculated cell values.
    case "str":
      value = parseString(value, options);
      break;
    // Sometimes, XLSX stores strings as "inline" strings rather than "shared" (indexed) ones.
    // Perhaps the specification doesn't force it to use one or another.
    // Example: `<sheetData><row r="1"><c r="A1" s="1" t="inlineStr"><is><t>Test 123</t></is></c></row></sheetData>`.
    case "inlineStr":
      value = getInlineStringValue();
      if (value === void 0) {
        throw new Error('Unsupported "inline string" cell value structure: '.concat(getInlineStringXml()));
      }
      value = parseString(value, options);
      break;
    // XLSX tends to store string values as "shared" (indexed) ones.
    // "Shared" strings is a way for an Excel editor to reduce
    // the file size by storing "commonly used" strings in a dictionary
    // and then referring to such strings by their index in that dictionary.
    // Example: `<sheetData><row r="1"><c r="A1" s="1" t="s"><v>0</v></c></row></sheetData>`.
    case "s":
      var sharedStringIndex = Number(value);
      if (isNaN(sharedStringIndex)) {
        throw new Error('Invalid "shared" string index: '.concat(value));
      }
      if (sharedStringIndex >= sharedStrings.length) {
        throw new Error('An out-of-bounds "shared" string index: '.concat(value));
      }
      value = sharedStrings[sharedStringIndex];
      value = parseString(value, options);
      break;
    // Boolean (TRUE/FALSE) values are stored as either "1" or "0"
    // in cells of type "b".
    case "b":
      if (value === "1") {
        value = true;
      } else if (value === "0") {
        value = false;
      } else {
        throw new Error('Unsupported "boolean" cell value: '.concat(value));
      }
      break;
    // XLSX specification seems to support cells of type "z":
    // blank "stub" cells that should be ignored by data processing utilities.
    case "z":
      value = void 0;
      break;
    // XLSX specification also defines cells of type "e" containing a numeric "error" code.
    // It's not clear what that means though.
    // They also wrote: "and `w` property stores its common name".
    // It's unclear what they meant by that.
    case "e":
      value = decodeError(value);
      break;
    // XLSX supports date cells of type "d", though seems like it (almost?) never
    // uses it for storing dates, preferring "n" numeric timestamp cells instead.
    // The value of a "d" cell is supposedly a string in "ISO 8601" format.
    // I haven't seen an XLSX file having such cells.
    // Example: `<sheetData><row r="1"><c r="A1" s="1" t="d"><v>2021-06-10T00:47:45.700Z</v></c></row></sheetData>`.
    case "d":
      if (value === void 0) {
        break;
      }
      var parsedDate = new Date(value);
      if (isNaN(parsedDate.valueOf())) {
        throw new Error('Unsupported "date" cell value: '.concat(value));
      }
      value = parsedDate;
      break;
    // Numeric cells have type "n".
    case "n":
      if (value === void 0) {
        break;
      }
      var styleId = getStyleId();
      if (styleId && isDateFormatStyle(styleId, styles, options)) {
        value = parseNumberDefault(value);
        value = parseExcelDate(value, {
          epoch1904
        });
      } else {
        var parseNumber = options.parseNumber || parseNumberDefault;
        value = parseNumber(value);
      }
      break;
    default:
      throw new TypeError("Cell type not supported: ".concat(type));
  }
  if (value === void 0) {
    value = null;
  }
  return value;
}
function decodeError(errorCode) {
  switch (errorCode) {
    case 0:
      return "#NULL!";
    case 7:
      return "#DIV/0!";
    case 15:
      return "#VALUE!";
    case 23:
      return "#REF!";
    case 29:
      return "#NAME?";
    case 36:
      return "#NUM!";
    case 42:
      return "#N/A";
    case 43:
      return "#GETTING_DATA";
    default:
      return "#ERROR_".concat(errorCode);
  }
}
function parseString(value, options) {
  if (options.trim !== false) {
    value = value.trim();
  }
  if (value === "") {
    value = void 0;
  }
  return value;
}
function parseNumberDefault(stringifiedNumber) {
  var parsedNumber = Number(stringifiedNumber);
  if (isNaN(parsedNumber)) {
    throw new Error('Invalid "numeric" cell value: '.concat(stringifiedNumber));
  }
  return parsedNumber;
}
function _slicedToArray$2(arr, i) {
  return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _unsupportedIterableToArray$5(arr, i) || _nonIterableRest$2();
}
function _nonIterableRest$2() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$5(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$5(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$5(o, minLen);
}
function _arrayLikeToArray$5(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _iterableToArrayLimit$2(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) ;
      else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles$2(arr) {
  if (Array.isArray(arr)) return arr;
}
function parseCellCoordinates(coordinatesString) {
  var _coordinatesString$sp = coordinatesString.split(/(\d+)/), _coordinatesString$sp2 = _slicedToArray$2(_coordinatesString$sp, 2), column = _coordinatesString$sp2[0], row = _coordinatesString$sp2[1];
  return [
    // Row.
    Number(row),
    // Column.
    // It's not clear why would `column` ever be non-trimmed,
    // but if it was added here then perhaps it could hypothetically happen, or smth.
    getColumnNumberFromColumnLetters(column.trim())
  ];
}
var LETTERS = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
function getColumnNumberFromColumnLetters(columnLetters) {
  var n = 0;
  var i = 0;
  while (i < columnLetters.length) {
    n *= 26;
    n += LETTERS.indexOf(columnLetters[i]);
    i++;
  }
  return n;
}
function parseCell(element, sheetDocument, sharedStrings, styles, epoch1904, options) {
  var coordinates = parseCellCoordinates(element.getAttribute("r"));
  var valueElement = getCellValueElement(sheetDocument, element);
  var value = valueElement && valueElement.textContent;
  var type = element.getAttribute("t");
  return {
    row: coordinates[0],
    column: coordinates[1],
    value: parseCellValue(value, type, {
      getInlineStringValue: function getInlineStringValue() {
        return getCellInlineStringValue(sheetDocument, element);
      },
      getInlineStringXml: function getInlineStringXml() {
        return getOuterXml(element);
      },
      getStyleId: function getStyleId() {
        return element.getAttribute("s");
      },
      styles,
      sharedStrings,
      epoch1904,
      options
    })
  };
}
function parseCells(sheetDocument, sharedStrings, styles, epoch1904, options) {
  var cells = getCellElements(sheetDocument);
  if (cells.length === 0) {
    return [];
  }
  return cells.map(function(element) {
    return parseCell(element, sheetDocument, sharedStrings, styles, epoch1904, options);
  });
}
function _slicedToArray$1(arr, i) {
  return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$4(arr, i) || _nonIterableRest$1();
}
function _nonIterableRest$1() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$4(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$4(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen);
}
function _arrayLikeToArray$4(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _iterableToArrayLimit$1(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) ;
      else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles$1(arr) {
  if (Array.isArray(arr)) return arr;
}
function parseSheetDimensions(sheetDocument) {
  var dimensions = getDimensions(sheetDocument);
  if (dimensions) {
    dimensions = dimensions.split(":").map(parseCellCoordinates).map(function(_ref) {
      var _ref2 = _slicedToArray$1(_ref, 2), row = _ref2[0], column = _ref2[1];
      return {
        row,
        column
      };
    });
    if (dimensions.length === 1) {
      dimensions = [dimensions[0], dimensions[0]];
    }
    return dimensions;
  }
}
function reconstructSheetDimensionsFromSheetCells(cells) {
  var comparator = function comparator2(a, b) {
    return a - b;
  };
  var allRows = cells.map(function(cell) {
    return cell.row;
  }).sort(comparator);
  var allCols = cells.map(function(cell) {
    return cell.column;
  }).sort(comparator);
  var minRow = allRows[0];
  var maxRow = allRows[allRows.length - 1];
  var minCol = allCols[0];
  var maxCol = allCols[allCols.length - 1];
  return [{
    row: minRow,
    column: minCol
  }, {
    row: maxRow,
    column: maxCol
  }];
}
function _createForOfIteratorHelperLoose$3(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike) {
    if (it) o = it;
    var i = 0;
    return function() {
      if (i >= o.length) return { done: true };
      return { done: false, value: o[i++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$3(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$3(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen);
}
function _arrayLikeToArray$3(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function dropEmptyRows(data) {
  var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, rowIndexSourceMap = _ref.rowIndexSourceMap, _ref$accessor = _ref.accessor, accessor = _ref$accessor === void 0 ? function(_) {
    return _;
  } : _ref$accessor, onlyTrimAtTheEnd = _ref.onlyTrimAtTheEnd;
  var i = data.length - 1;
  while (i >= 0) {
    var empty = true;
    for (var _iterator = _createForOfIteratorHelperLoose$3(data[i]), _step; !(_step = _iterator()).done; ) {
      var cell = _step.value;
      if (accessor(cell) !== null) {
        empty = false;
        break;
      }
    }
    if (empty) {
      data.splice(i, 1);
      if (rowIndexSourceMap) {
        rowIndexSourceMap.splice(i, 1);
      }
    } else if (onlyTrimAtTheEnd) {
      break;
    }
    i--;
  }
  return data;
}
function _createForOfIteratorHelperLoose$2(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike) {
    if (it) o = it;
    var i = 0;
    return function() {
      if (i >= o.length) return { done: true };
      return { done: false, value: o[i++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$2(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$2(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen);
}
function _arrayLikeToArray$2(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function dropEmptyColumns(data) {
  var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$accessor = _ref.accessor, accessor = _ref$accessor === void 0 ? function(_) {
    return _;
  } : _ref$accessor, onlyTrimAtTheEnd = _ref.onlyTrimAtTheEnd;
  var i = data[0].length - 1;
  while (i >= 0) {
    var empty = true;
    for (var _iterator = _createForOfIteratorHelperLoose$2(data), _step; !(_step = _iterator()).done; ) {
      var row = _step.value;
      if (accessor(row[i]) !== null) {
        empty = false;
        break;
      }
    }
    if (empty) {
      var j = 0;
      while (j < data.length) {
        data[j].splice(i, 1);
        j++;
      }
    } else if (onlyTrimAtTheEnd) {
      break;
    }
    i--;
  }
  return data;
}
function _createForOfIteratorHelperLoose$1(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike) {
    if (it) o = it;
    var i = 0;
    return function() {
      if (i >= o.length) return { done: true };
      return { done: false, value: o[i++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$1(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
}
function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) ;
      else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function convertCellsToData2dArray(cells, dimensions) {
  if (cells.length === 0) {
    return [];
  }
  var _dimensions = _slicedToArray(dimensions, 2);
  _dimensions[0];
  var rightBottom = _dimensions[1];
  var colsCount = rightBottom.column;
  var rowsCount = rightBottom.row;
  var data = new Array(rowsCount);
  var i = 0;
  while (i < rowsCount) {
    data[i] = new Array(colsCount);
    var j = 0;
    while (j < colsCount) {
      data[i][j] = null;
      j++;
    }
    i++;
  }
  for (var _iterator = _createForOfIteratorHelperLoose$1(cells), _step; !(_step = _iterator()).done; ) {
    var cell = _step.value;
    var rowIndex = cell.row - 1;
    var columnIndex = cell.column - 1;
    if (columnIndex < colsCount && rowIndex < rowsCount) {
      data[rowIndex][columnIndex] = cell.value;
    }
  }
  data = dropEmptyRows(
    dropEmptyColumns(data, {
      onlyTrimAtTheEnd: true
    }),
    {
      onlyTrimAtTheEnd: true
    }
    // { onlyTrimAtTheEnd: true, rowIndexSourceMap: options.rowIndexSourceMap }
  );
  return data;
}
function parseSheet(content, xml2, sharedStrings, styles, epoch1904, options) {
  var sheetDocument = xml2.createDocument(content);
  var cells = parseCells(sheetDocument, sharedStrings, styles, epoch1904, options);
  var dimensions = parseSheetDimensions(sheetDocument) || reconstructSheetDimensionsFromSheetCells(cells);
  return convertCellsToData2dArray(cells, dimensions);
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike) {
    if (it) o = it;
    var i = 0;
    return function() {
      if (i >= o.length) return { done: true };
      return { done: false, value: o[i++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function parseSpreadsheetContents(contents, xml2) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var getFileContent = function getFileContent2(filePath) {
    if (!contents[filePath]) {
      throw new Error('"'.concat(filePath, '" file not found inside the *.xlsx file zip archive'));
    }
    return contents[filePath];
  };
  var filePaths = parseFilePaths(getFileContent("xl/_rels/workbook.xml.rels"), xml2);
  var sharedStrings = filePaths.sharedStrings ? parseSharedStrings(getFileContent(filePaths.sharedStrings), xml2) : [];
  var styles = filePaths.styles ? parseStyles(getFileContent(filePaths.styles), xml2) : {};
  var _parseSpreadsheetInfo = parseSpreadsheetInfo(getFileContent("xl/workbook.xml"), xml2), sheets = _parseSpreadsheetInfo.sheets, epoch1904 = _parseSpreadsheetInfo.epoch1904;
  var sheetIdsToRead = options.sheets && options.sheets.map(function(sheet) {
    return getSheetId(sheet, sheets);
  });
  var sheetsData = [];
  for (var _i = 0, _Object$keys = Object.keys(filePaths.sheets); _i < _Object$keys.length; _i++) {
    var sheetId = _Object$keys[_i];
    if (sheetIdsToRead && !sheetIdsToRead.includes(sheetId)) {
      continue;
    }
    sheetsData.push({
      sheet: getSheetNameById(sheetId, sheets),
      data: parseSheet(getFileContent(filePaths.sheets[sheetId]), xml2, sharedStrings, styles, epoch1904, options)
    });
  }
  return sheetsData;
}
function getSheetId(sheet, sheets) {
  if (typeof sheet === "string") {
    for (var _iterator = _createForOfIteratorHelperLoose(sheets), _step; !(_step = _iterator()).done; ) {
      var _sheet = _step.value;
      if (_sheet.name === sheet) {
        return _sheet.relationId;
      }
    }
    throw new Error('Sheet "'.concat(sheet, '" not found. Available sheets: ').concat(sheets.map(function(_ref) {
      var name = _ref.name;
      return '"'.concat(name, '"');
    }).join(", ")));
  } else {
    if (sheet <= sheets.length) {
      return sheets[sheet - 1].relationId;
    }
    throw new Error("Sheet number out of bounds: ".concat(sheet, ". Available sheets count: ").concat(sheets.length));
  }
}
function getSheetNameById(sheetId, sheets) {
  for (var _iterator2 = _createForOfIteratorHelperLoose(sheets), _step2; !(_step2 = _iterator2()).done; ) {
    var sheet = _step2.value;
    if (sheet.relationId === sheetId) {
      return sheet.name;
    }
  }
  throw new Error("Sheet ID not found: ".concat(sheetId));
}
function readXlsxFile(input, options) {
  return unpackXlsxFile(input).then(function(contents) {
    return parseSpreadsheetContents(contents, xml, options);
  });
}
class SheetService {
  static async fetchFromUrl(url, sheetName) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const results = await readXlsxFile(arrayBuffer, { sheets: [sheetName] });
    return results[0].data;
  }
  static convertSheetToObjects(sheet) {
    if (sheet.length < 2) {
      throw new Error("CSV file is empty or malformed");
    }
    const months = /* @__PURE__ */ new Map();
    let currentMonth = null;
    sheet.slice(1).forEach((row) => {
      const monthName = row[0];
      const income = row[1];
      const incomeAmount = row[2];
      const fixedExpense = row[3];
      const fixedAmount = row[4];
      const variableExpense = row[5];
      const variableDescription = row[6];
      const variableAmount = row[7];
      if (monthName) {
        currentMonth = new Month(monthName);
        months.set(monthName, currentMonth);
      }
      if (!currentMonth) return;
      if (income && incomeAmount) {
        currentMonth.addIncome(new Income(income, parseInt(incomeAmount)));
      }
      if (fixedExpense && fixedAmount) {
        currentMonth.addFixedExpense(new Expense(fixedExpense, "", parseInt(fixedAmount)));
      }
      if (variableExpense && variableAmount) {
        currentMonth.addVariableExpense(new Expense(variableExpense, variableDescription, parseInt(variableAmount)));
      }
    });
    return Array.from(months.values());
  }
}
class SimulationManager {
  constructor() {
    this.simulation = null;
    this.months = null;
    this.currentMonth = null;
    this.originalSaldo = 0;
    this.previousSaldo = 0;
    this.toeslagNaam = "";
    this.toeslagPercentage = 0;
    this.slideNumber = 0;
    this.slidesChangedStack = [];
  }
  async initialize(sheetUrl, sheetName) {
    if (this.months === null && sheetUrl) {
      const data = await SheetService.fetchFromUrl(sheetUrl, sheetName);
      this.months = SheetService.convertSheetToObjects(data);
    }
  }
  isInitialized() {
    return Array.isArray(this.months) && this.months.length > 0;
  }
  isDifferentThenOriginalSaldo(saldo) {
    return this.originalSaldo !== saldo;
  }
  startNewSimulation(startSaldo) {
    if (typeof startSaldo !== "number") {
      throw new Error("startSaldo must be a number");
    }
    this.originalSaldo = this.previousSaldo = startSaldo;
    this.simulation = new SaldoSimulation(startSaldo);
    this.slideNumber = 0;
    this.slidesChangedStack = [];
  }
  progressOneSlide() {
    this.slideNumber++;
    if (this.slidesChangedStack[this.slideNumber] === void 0) {
      this.slidesChangedStack[this.slideNumber] = false;
    }
  }
  previousSlide() {
    this.slideNumber = this.slideNumber - 2;
    if (this.slideNumber < 0) {
      this.slideNumber = 0;
    }
  }
  markSlideAsChanged() {
    this.slidesChangedStack[this.slideNumber] = true;
  }
  applyToeslagSettings(naam, percentage) {
    if (typeof naam !== "string") {
      throw new Error("naam must be a string");
    }
    if (typeof percentage !== "number") {
      throw new Error("percentage must be a number");
    }
    this.toeslagNaam = naam;
    this.toeslagPercentage = percentage;
    this.applyToeslagPercentageToIncomes();
  }
  applyToeslagPercentageToIncomes() {
    if (!this.toeslagNaam) return;
    let applied = false;
    let foundToeslagNaam = false;
    this.months.forEach(
      (month) => month.getIncomes().forEach((income) => {
        if (income.getName() === this.toeslagNaam) {
          foundToeslagNaam = true;
          if (income.getPercentage() === this.toeslagPercentage) return;
          income.setPercentage(this.toeslagPercentage);
          applied = true;
        }
      })
    );
    if (applied) {
      console.log(`Applied ${this.toeslagPercentage}% to ${this.toeslagNaam}`);
    }
    if (!foundToeslagNaam) {
      console.error(`Could not find toeslag_naam '${this.toeslagNaam}' in sheet data`);
    }
  }
  setCurrentMonth(monthName) {
    var _a2;
    let foundMonth = this.getMonth(monthName);
    if (!foundMonth) {
      console.error(`Cannot find ${monthName} in months data`);
      this.currentMonth = void 0;
      return false;
    }
    if (foundMonth.name !== ((_a2 = this.currentMonth) == null ? void 0 : _a2.name)) {
      this.currentMonth = foundMonth;
      console.log(`Month changed to ${foundMonth.name}`);
    }
    return true;
  }
  getMonth(monthName) {
    if (typeof monthName !== "string") {
      throw new Error("monthName must be a string");
    }
    if (!monthName) return;
    return this.months.find((month) => month.name === monthName);
  }
  getCurrentSaldo() {
    var _a2;
    return ((_a2 = this.simulation) == null ? void 0 : _a2.getSaldo()) ?? 0;
  }
  previousSlideHasDifferentSaldo() {
    if (this.slidesChangedStack.length === 0) return false;
    if (this.slideNumber < 2) return false;
    return this.slidesChangedStack[this.slideNumber - 1];
  }
  getPreviousSaldo() {
    return this.previousSaldo;
  }
  updatePreviousSaldo() {
    const currentSaldo = this.getCurrentSaldo();
    this.previousSaldo = currentSaldo;
  }
  applyIncomes() {
    if (!this.currentMonth || !this.simulation) return;
    this.simulation.applyIncomes(this.currentMonth.getIncomes());
    this.markSlideAsChanged();
  }
  applyFixedExpenses() {
    if (!this.currentMonth || !this.simulation) return;
    const expenses = this.currentMonth.getFixedExpenses();
    this.simulation.applyFixedExpenses(expenses);
    this.markSlideAsChanged();
  }
  applyVariableExpense() {
    if (!this.currentMonth || !this.simulation) return;
    const expense = this.currentMonth.getNextVariableExpense(true);
    if (expense === null) return;
    this.simulation.applyVariableExpense(expense);
    this.markSlideAsChanged();
  }
  applyCustomExpense(amount) {
    if (typeof amount !== "number") {
      throw new Error("amount must be a number");
    }
    if (!this.simulation) return;
    this.simulation.applyCustomExpense(amount);
    this.markSlideAsChanged();
  }
  getVariableExpense() {
    if (!this.currentMonth || !this.simulation) return;
    return this.currentMonth.getNextVariableExpense(false);
  }
}
class UIManager {
  static updateProgressBar(months, currentMonth) {
    if (!currentMonth || !(months == null ? void 0 : months.length) || !Array.isArray(months) || !months.includes(currentMonth)) {
      console.error("UIManager.updateProgressBar: invalid parameters", { currentMonth, months });
      return;
    }
    const monthName = document.querySelector(".month-name");
    const circleContainer = document.querySelector(".circle-container");
    if (!monthName || !circleContainer) {
      console.error("UIManager.updateProgressBar: .month-name or .circle-container not found in DOM");
      return;
    }
    if (monthName) {
      monthName.textContent = currentMonth.name;
    }
    const percentage = months.indexOf(currentMonth) / (months.length - 1) * 65;
    circleContainer.style.left = `calc(${percentage}% - 18px)`;
  }
  static updateAmount(currentAmount, newAmount) {
    const amountElement = document.querySelector(".amount");
    if (!amountElement) return;
    if (currentAmount === newAmount) {
      amountElement.textContent = String(newAmount);
      return;
    }
    const start = parseInt(currentAmount) || 0;
    const end = parseInt(newAmount) || 0;
    const duration = 1e3;
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(start + (end - start) * progress);
      amountElement.textContent = String(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }
  static replaceQuestionTextVariables(currentMonth, toeslagNaam, toeslagPercentage) {
    const questionText = document.querySelector(".QuestionText");
    if (!questionText || !currentMonth) return;
    const variables = {
      "income": () => this.replaceByList(currentMonth.getIncomes(), (item) => {
        return `${item.getName()} € ${item.getAmount()}`;
      }),
      "fixed_expenses": () => this.replaceByList(
        currentMonth.getFixedExpenses(),
        (item) => `${item.getName()} € ${item.getAmount()}`
      ),
      "variable_expense_name": () => {
        const expense = currentMonth.getNextVariableExpense(false);
        return expense ? expense.getName() : "{{ERROR}}";
      },
      "variable_expense_description": () => {
        const expense = currentMonth.getNextVariableExpense(false);
        return expense ? expense.getDescription() : "{{ERROR}}";
      },
      "variable_expense_amount": () => {
        const expense = currentMonth.getNextVariableExpense(false);
        return expense ? expense.getAmount() : "{{ERROR}}";
      }
    };
    let content = questionText.innerHTML;
    Object.entries(variables).forEach(([key, getter]) => {
      const placeholder = `{{${key}}}`;
      content = content.replace(placeholder, getter());
    });
    if (content !== questionText.innerHTML) {
      questionText.innerHTML = content;
      console.log("Variables were replaced in question text.");
    }
  }
  static replaceByList(items, formatter) {
    return `<ul>${items.map(
      (item) => `<li>${formatter(item)}</li>`
    ).join("")}</ul>`;
  }
  static togglePreviousButton(enable) {
    const previousButton = document.querySelector("#PreviousButton");
    if (previousButton) {
      previousButton.style.display = enable ? "block" : "none";
    }
  }
}
(function() {
  console.log("toeslagen.js is loaded.");
  const simulationManager = new SimulationManager();
  async function runOnNewSlide(sheetUrl, sheetName, enablePreviousButton, startSaldo, currentMonthName, currentToeslagNaam, currentToeslagPercentage) {
    try {
      const parsedEnablePrevious = enablePreviousButton === "1";
      const parsedStartSaldo = Number(startSaldo) || 0;
      const parsedMonthName = String(currentMonthName || "");
      const parsedToeslagNaam = String(currentToeslagNaam || "");
      const parsedToeslagPercentage = Number(currentToeslagPercentage) || 0;
      UIManager.togglePreviousButton(parsedEnablePrevious);
      if (!sheetUrl) return;
      if (!simulationManager.isInitialized()) {
        await simulationManager.initialize(sheetUrl, sheetName);
        console.log("Simulation data initialized");
      }
      if (!parsedMonthName || parsedStartSaldo === 0) return;
      if (isNewSimulation(parsedStartSaldo)) {
        simulationManager.startNewSimulation(parsedStartSaldo);
        console.log("Simulation started with saldo " + parsedStartSaldo);
      }
      if (!simulationManager.setCurrentMonth(parsedMonthName)) {
        return;
      }
      simulationManager.progressOneSlide();
      if (simulationManager.previousSlideHasDifferentSaldo()) {
        console.log("Saldo change from " + simulationManager.getPreviousSaldo() + " to " + simulationManager.getCurrentSaldo());
      }
      if (parsedToeslagNaam) {
        simulationManager.applyToeslagSettings(parsedToeslagNaam, parsedToeslagPercentage);
      }
      updateUI(parsedEnablePrevious);
      simulationManager.updatePreviousSaldo();
      console.log("Slide update completed successfully");
    } catch (error) {
      console.error("Error in runOnNewSlide:", error);
    }
  }
  function isNewSimulation(parsedStartSaldo) {
    return parsedStartSaldo > 0 && simulationManager.isDifferentThenOriginalSaldo(parsedStartSaldo);
  }
  function updateUI(parsedEnablePrevious) {
    if (parsedEnablePrevious) {
      UIManager.togglePreviousButton(!simulationManager.previousSlideHasDifferentSaldo());
    }
    UIManager.replaceQuestionTextVariables(
      simulationManager.currentMonth,
      simulationManager.toeslagNaam,
      simulationManager.toeslagPercentage
    );
    UIManager.updateProgressBar(simulationManager.months, simulationManager.currentMonth);
    UIManager.updateAmount(simulationManager.getPreviousSaldo(), simulationManager.getCurrentSaldo());
  }
  window.toeslagen = {
    runOnNewSlide,
    getMonths: () => {
      return simulationManager.months;
    },
    applyIncomes: () => {
      simulationManager.applyIncomes();
      console.log("Incomes (" + simulationManager.currentMonth.name + ") applied");
    },
    applyFixedExpenses: () => {
      simulationManager.applyFixedExpenses();
      console.log("Fixed expenses (" + simulationManager.currentMonth.name + ") applied");
    },
    applyVariableExpense: () => {
      simulationManager.applyVariableExpense();
      console.log("Variable expense (" + simulationManager.currentMonth.name + ") applied");
    },
    applyCustomExpense: (amount) => {
      const parsedAmount = Number(amount) || 0;
      simulationManager.applyCustomExpense(parsedAmount);
      console.log("Custom expense of " + parsedAmount + " applied");
    },
    getVariableExpense: () => {
      return simulationManager.getVariableExpense();
    },
    runOnPreviousButton: () => {
      console.log("Previous button clicked");
      simulationManager.previousSlide();
    }
  };
})();
