/**
 * Created by Rustam Dushabaev on 1/18/2017.
 */

function calculateFrequencies(str) {
    let map = {};
    for(let i=0; i < str.length; i++){
        if (Object.keys(map).indexOf(str[i]) != -1)
            map[str[i]] +=1;
        else
            map[str[i]] = 1;
    }
    return map;
}

function Node(left, right) {
    this.left = left;
    this.right = right;
}

function Pair(key, value) {
    this.key = key;
    this.value = value;
}

function popMinVal(arr) {
    let min = arr.reduce(function (a, b) {
        return a.value <= b.value ? a : b;
    });
    arr.splice(arr.indexOf(min), 1);
    return min;
}

function buildTree(str) {
    let map = calculateFrequencies(str);

    let nodeList = [];
    let chars = Object.keys(map);
    for (let i = 0; i < chars.length; ++i){
        let freq = map[chars[i]];
        nodeList.push(new Pair(chars[i], freq));
    }

    // merge

    while(nodeList.length > 1){
        let left = popMinVal(nodeList);
        let right = popMinVal(nodeList);

        let node = new Pair(new Node(left, right), left.value + right.value);
        nodeList.push(node);
    }
    return nodeList[0];
}

function getCodeRecursive(char, tree, code) {
    if (tree.key instanceof Node) {
        let res = getCodeRecursive(char, tree.key.left, code + '0');
        if (res.length == 0)
            res = getCodeRecursive(char, tree.key.right, code + '1');
        return res;
    } else
        if (tree.key == char)
            return code;
        else
            return '';
}

function getCode(char, tree) {
    return getCodeRecursive(char, tree, '');
}

function encode(str, tree) {
    let res = '';
    for(let i = 0; i < str.length; ++i){
        res += getCode(str[i], tree);
    }
    return res;
}

function decode(str, tree) {
    let currNode = tree.key;
    let res = '';
    for(let i = 0; i < str.length; ++i){
        currNode = str[i] == '0' ? currNode.left.key : currNode.right.key;
        if (!(currNode instanceof Node)) {
            res += currNode;
            currNode = tree.key;
        }
    }
    return res;
}

function loaded() {
    const input = document.getElementById("encodeText");

    input.oninput = function() {
        let tree = buildTree(input.value);
        let encoded = encode(input.value, tree);
        document.getElementById('encoded').innerHTML = encoded;
        document.getElementById('decoded').innerHTML = decode(encoded, tree);
        let freqs = calculateFrequencies(input.value);
        let fKeys = Object.keys(freqs);
        let list = document.getElementById('list');
        list.innerHTML = '';
        for(let i = 0; i < fKeys.length; ++i) {
            let p = document.createElement('li');
            p.innerHTML = (fKeys[i] == ' ' ? "' '": fKeys[i]) + ":" + getCode(fKeys[i], tree);
            list.appendChild(p);
        }
    };
}


document.addEventListener("DOMContentLoaded", loaded);