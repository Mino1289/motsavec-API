require("dotenv").config();
const app = require("express")();
const port = process.env.PORT;
const lesmots = require("./data.json");

app.get("/", (req, res) => {
    res.type("json");

    var E = lesmots;
    var haskey = Object.keys(req.query).filter((key) => key == "key").length >= 1;
    if (!haskey) {
        res.status(403);
        res.send("No key");
        return;
    }
    for (const [key, value] of Object.entries(req.query)) {
        if (key == "key" && value != process.env.KEY) {
            res.status(403);
            res.send("Wrong key");
            return;
        }
        if (key == "start") {
            E = start(value, E || lesmots);
        }
        if (key == "end") {
            E = end(value, E || lesmots);
        }
        if (key == "in") {
            E = contain(value.split(""), E || lesmots);
        }
        if (key == "nin") {
            E = nocontain(value.split(""), E || lesmots);
        }
        if (key == "suite") {
            E = suite(value, E || lesmots);
        }
        if (key == "size") {
            E = sized(parseInt(value), E || lesmots);
        }
    }
    res.send(E);
})

/**
 * Count the number of occurence of s in the string
 * @param {String} s
 * @returns
 */
String.prototype.count = function (s) {
    var result = 0;
    for (let i = 0; i < this.length; i++) {
        if (this[i] == s) result++;
    }
    return result;
};
/**
 *
 * @param {String[]} L la liste de lettre à tester
 * @param {String} m le mot à tester
 * @returns
 */
const fil = (L, m) => {
    var f = [];
    for (let i = 0; i < L.length; i++) {
        if (
            m.includes(L[i]) &&
            m.count(L[i]) >= L.filter((x) => x == L[i]).length
        ) {
            f.push(L[i]);
        }
    }
    if (f.length == L.length) return true;
    else return false;
};
/**
 *
 * @param {String[]} L la liste de lettre à tester
 * @param {String} m le mot à tester
 * @returns
 */
const nofil = (L, m) => {
    var f = [];
    for (let i = 0; i < L.length; i++) {
        if (m.includes(L[i])) {
            f.push(L[i]);
        }
    }
    if (f.length == 0) return true;
    else return false;
};
/**
 * @param {String[]} L Liste de lettre qui ne doivent pas etre dans le mots.
 * @param {String[]} M Les mots à filtrer
 */
const nocontain = (L, M) => {
    var E = [];
    M.forEach((mot) => {
        if (nofil(L, mot)) {
            E.push(mot);
        }
    });
    return E;
};
/**
 * @param {String[]} L Les lettres
 * @param {String[]} M Les mots à filtrer
 */
const contain = (L, M) => {
    var E = [];
    M.forEach((mot) => {
        if (fil(L, mot)) {
            E.push(mot);
        }
    });
    return E;
};
/**
 * @param {String} s le mot commence par s
 * @param {String[]} Mots Liste des mots a filtrer
 */
const start = (s, M) => {
    var E = [];
    M.forEach((mot) => {
        if (mot.startsWith(s)) E.push(mot);
    });
    return E;
};
/**
 * @param {String} s le mot fini par s
 * @param {String[]} Mots Liste des mots a filtrer
 */
const end = (s, M) => {
    var E = [];
    M.forEach((mot) => {
        if (mot.endsWith(s)) E.push(mot);
    });
    return E;
};
/**
 *
 * @param {Number} n
 * @param {String[]} M
 */
const sized = (n, M) => {
    var E = [];
    M.forEach((mot) => {
        if (mot.length === n) E.push(mot);
    });
    return E;
};
/**
 * @param {String} s suite de caractère dans la liste de mot
 * @param {String[]} M liste de mot
 */
const suite = (s, M) => {
    var E = [];
    M.forEach((mot) => {
        if (mot.includes(s)) E.push(mot);
    });
    return E;
};


app.listen(port, () => {
    console.log(`App alive at http://localhost:${port}/`);
})