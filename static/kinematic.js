function main() {
    let input = {
        0: parseFloat(document.getElementById('time').value),
        1: parseFloat(document.getElementById('disp').value),
        2: parseFloat(document.getElementById('iniV').value),
        3: parseFloat(document.getElementById('finV').value),
        4: parseFloat(document.getElementById('accel').value)
    };

    let reqAns = parseInt(document.getElementById("reqAns").value);
    let result = document.getElementById('result');

    //console.log(input.time, input.disp, input.iniV, input.finV, input.accel, ans);

    /*
    value="0">Time elapsed<
    value="1">Displacement<
    value="2">Initial Velocity<
    value="3">Final Velocity<
    value="4">Acceleration<
    */

    let equation = {
        1: "\\(V_f = V_i +a\\Delta t\\)",
        2: "\\(\\Delta d = V_i \\Delta t + \\frac{1}{2} a \\Delta t^2\\)",
        3: "\\(\\Delta d = V_f \\Delta t - \\frac{1}{2} a \\Delta t^2\\)",
        4: "\\(V_f^2 = V_i^2 + 2a \\Delta d\\)"
    };

    let boolErr = false;
    let eqUsed = NaN;
    let ans = NaN;
    let t = input[0], d = input[1], vi = input[2], vf = input[3], a = input[4];

    let sum = 0;
    for (let key in input) {
        // console.log(input[key]);
        if (!isNaN(input[key])) {
            sum++;
        }
    }
    // console.log(sum);
    // console.log("reqAns" + reqAns);
    if (sum < 3) {
        err();
    }

    let unitId;
    switch (reqAns) {
        case 0:
            unitId = "time";
            break;
        case 1:
            unitId = "disp";
            break;
        case 2:
            unitId = "iniV";
            break;
        case 3:
            unitId = "finV";
            break;
        case 4:
            unitId = "accel";
            break;
    }

    let unit = document.getElementById(unitId).getAttribute('placeholder').substring(1, document.getElementById(unitId).getAttribute('placeholder').length - 1);

    // If user gave value already, return value
    for (let i = 0; i <= 4; i++) {
        if (!isNaN(input[i]) && reqAns == i) {
            result.innerHTML = "You already got the answer: " + (input[i]) + unit;
            return;
        }
    }

    switch (reqAns) {
        case 0: // find time CHECK
            if (isNaN(input[4])) { // accel not available
                err();
            }

            if (!isNaN(input[2]) && !isNaN(input[3])) { // accel, Vini, Vfin available
                eq1();
            }
            else if (!isNaN(input[1])) { // disp available
                if (!isNaN(input[2])) { // accel, disp, Vini available
                    eq2();
                } else if (!isNaN(input[3])) { // accel, disp, Vfin available
                    eq3();
                } else { // only accel and disp available FORBIDDABLE
                    err();
                }
            } else {
                err();
            }
            break;
        case 1: // find displacement CHECK
            if (isNaN(input[4])) { // accel not available
                err();
            }

            if (!isNaN(input[0])) { // time available
                if (!isNaN(input[2])) { // accel, time, Vini avaialble
                    eq2();
                } else if (!isNaN(input[3])) {  // accel, time, Vfin available
                    eq3();
                } else {
                    err();
                }
            } else if (!isNaN(input[2]) && !isNaN(input[3])) { // accel, Vini, Vfin avaiable
                eq4();
            }
            else {
                err();
            }

            break;
        case 2: // find initial velocity CHECK
            if (isNaN(input[4])) { // accel not available
                err();
            }
            if (!isNaN(input[1]) && !isNaN(input[3])) { // accel, disp, Vfin available
                eq4();
            } else if (!isNaN(input[1]) && !isNaN(input[0])) { // accel, disp, time available
                eq2();
            } else if (!isNaN(input[0]) && !isNaN(input[3])) { // accel, time and Vfin available
                eq1();
            } else { // code shouldn't reach here, just in case
                err();
            }
            break;
        case 3: // find final velocity CHECK
            if (isNaN(input[4])) { // accel not available
                err();
            }
            if (!isNaN(input[1]) && !isNaN(input[2])) { // accel, disp, VIni available
                eq4();
            } else if (!isNaN(input[1]) && !isNaN(input[0])) { // accel, disp, time available
                eq3();
            } else if (!isNaN(input[0]) && !isNaN(input[2])) { // accel, time and Vini available
                eq1();
            } else { // code shouldn't reach here, just in case
                err();
            }
            break;
        case 4: // find acceleration CHECK
            if (isNaN(input[1])) { // disp not available
                if (!isNaN(input[0]) && (!isNaN(input[2]) && !isNaN(input[3]))) { // time, Vi and Vf given
                    eq1();
                } else {
                    err();
                }
            } else { // disp available
                if (!isNaN(input[2]) && !isNaN(input[3])) { // disp, both v given
                    eq4();
                }
                if (!isNaN(input[0])) { // time available
                    if (!isNaN(input[2])) { // disp, time and Vi
                        eq2();
                    }
                    if (!isNaN(input[3])) { // disp, time and Vf
                        eq3();
                    }
                } else {
                    err();
                }
            }
            break;
        default:
            err();
    }



    function err() {
        if (!boolErr) {
            let errMsg = "Given parameters are insufficient to calculate requested quantity.";
            result.innerHTML = (errMsg);
            alert(errMsg);
            boolErr = true;
            return;
        }
    }


    function eq1() { // Vf = Vi + at
        switch (reqAns) {
            case 0: // ask time
                ans = (vf - vi) / a;
                break;
            case 2: // ask vi
                ans = vf - a * t;
                break;
            case 3: // ask vf
                ans = vi + a * t;
                break;
            case 4: // ask accel
                ans = (vf - vi) / t;
                break;
            default:
                err();
        }
        eqUsed = 1;
    }

    function eq2() {
        switch (reqAns) {
            case 0: // ask time
                ans = -vi;
                let temp = (Math.sqrt(vi * vi + 2 * a * d)) / a;
                if (ans + temp > 0) {
                    ans += temp;
                } else {
                    ans -= temp;
                }
                break;
            case 1: // ask disp
                ans = vi * t + a * t * t / 2;
                break;
            case 2: // ask vi
                ans = (d - (0.5) * a * t * t) / t;
                break;
            case 4: // ask accel
                ans = 2 * (d - vi * t) / (t * t);
                break;
            default:
                err();
        }
        eqUsed = 2;
    }

    function eq3() {
        switch (reqAns) {
            case 0: // ask time
                ans = vf / a;
                let temp = (Math.sqrt(vf * vf - 2 * a * d)) / a;
                if (ans + temp > 0) {
                    ans += temp;
                } else {
                    ans -= temp;
                }
                break;
            case 1: // ask disp
                ans = vf * t - a * t * t / 2;
                break;
            case 3: // ask vf
                ans = (d + (0.5) * a * t * t) / t;
                break;
            case 4: // ask accel
                ans = 2 * (d * vf * t) / (t * t);
                break;
            default:
                err();
        }
        eqUsed = 3;
    }

    function eq4() {
        switch (reqAns) {
            case 1: // ask disp
                ans = (vf * vf - vi * vi) / (2 * a);
                break;
            case 2: // ask vi
                ans = Math.sqrt(vf * vf - 2 * a * d);
                break;
            case 3: // ask vf
                ans = Math.sqrt(vi * vi + 2 * a * d);
                break;
            case 4: // ask accel
                ans = (vf * vf - vi * vi) / (2 * d);
                break;
            default:
                err();
        }
        eqUsed = 4;
    }


    if (!boolErr) {
        numStr = ans.toString();
        let ind = numStr.indexOf(".");

        if (ind !== -1 && numStr.length - ind > 6) { // round to 5 decimal place if more than 5
            ans = parseFloat(ans.toFixed(5));
        }

        result.innerHTML = "The equation " + equation[eqUsed] + " is used, and the answer is " + ans + unit + ".";
    }

    MathJax.typeset();
}


//-----------------------------------------


function toggle(id) {
    let box = document.getElementById(id);
    let bool = box.checked;
    if (id == "linear") {
        document.getElementById("rotational").checked = !bool;
    } else if (id == "rotational") {
        document.getElementById("linear").checked = !bool;
    }
    pHToggle();
}

function pHToggle() {
    let mode;
    if (document.getElementById("linear").checked) {
        mode = "m";
    } else if (document.getElementById("rotational").checked) {
        mode = "rad";
    }
    document.getElementById("disp").setAttribute('placeholder', "(" + mode + ")");
    document.getElementById("iniV").setAttribute('placeholder', "(" + mode + "/s)");
    document.getElementById("finV").setAttribute('placeholder', "(" + mode + "/s)");
    document.getElementById("accel").setAttribute('placeholder', "(" + mode + "/s²)");
}