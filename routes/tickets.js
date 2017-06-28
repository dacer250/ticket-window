var express = require('express');
var router = express.Router();
var seats = [];
var queues = [];
// 初始化座位数据
function initSeatsData() {
    var seats = [], i, j, k,
        l = 26, // 座位排数
        n = 50, // 第一排座位数
        b = 4,  // 区块数
        row, block;
    for (i = 0; i < b; i++) {
        block = [];
        for (j = 0; j < l; j++) {
            row = [];
            for (k = 0; k < (n + j * 2); k++) {
                row[k] = 0;
            }
            block[j] = row;
        }
        seats[i] = block;
    }
    return seats;
}

//预分配排列组合队列
function devideSeatsPattern(seats) {
    /*var proportion = {
     1: 1,
     2: 1,
     3: 1,
     4: 1,
     5: 1
     }*/
    var i, j, k, p = 5, patternQueues = [];
    for (i = 0; i < seats.length; i++) {
        // 平均分配排数
        for (j = 0; j < seats[i].length; j++) {
            switch (Math.floor(j / p)) {
                case 0:
                    patternQueues[0] = patternQueues[0] || [];
                    for (k = 0; k < seats[i][j].length; k++) {
                        patternQueues[0].push([[i, j, k]]); // 做成单元素数组，方便格式统一
                    }
                    break;
                case 1:
                    patternQueues[1] = patternQueues[1] || [];
                    for (k = 0; k < seats[i][j].length; k = k + 2) {
                        if (k === seats[i][j].length - 1) {
                            patternQueues[0].push([[i, j, k]]);
                        } else {
                            patternQueues[1].push([[i, j, k], [i, j, k + 1]]);
                        }
                    }
                    break;
                case 2:
                    patternQueues[2] = patternQueues[2] || [];
                    for (k = 0; k < seats[i][j].length; k = k + 3) {
                        if (k === seats[i][j].length - 1) {
                            patternQueues[0].push([[i, j, k]]);
                        } else if (k === seats[i][j].length - 2) {
                            patternQueues[1].push([[i, j, k], [i, j, k + 1]]);
                        } else {
                            patternQueues[2].push([[i, j, k], [i, j, k + 1], [i, j, k + 2]]);
                        }
                    }
                    break;
                case 3:
                    patternQueues[3] = patternQueues[3] || [];
                    for (k = 0; k < seats[i][j].length; k = k + 4) {
                        if (k === seats[i][j].length - 1) {
                            patternQueues[0].push([[i, j, k]]);
                        } else if (k === seats[i][j].length - 2) {
                            patternQueues[1].push([[i, j, k], [i, j, k + 1]]);
                        } else if (k === seats[i][j].length - 3) {
                            patternQueues[2].push([[i, j, k], [i, j, k + 1], [i, j, k + 2]]);
                        } else {
                            patternQueues[3].push([[i, j, k], [i, j, k + 1], [i, j, k + 2], [i, j, k + 3]]);
                        }
                    }
                    break;
                case 4:
                default:
                    patternQueues[4] = patternQueues[4] || [];
                    for (k = 0; k < seats[i][j].length; k = k + 5) {
                        if (k === seats[i][j].length - 1) {
                            patternQueues[0].push([[i, j, k]]);
                        } else if (k === seats[i][j].length - 2) {
                            patternQueues[1].push([[i, j, k], [i, j, k + 1]]);
                        } else if (k === seats[i][j].length - 3) {
                            patternQueues[2].push([[i, j, k], [i, j, k + 1], [i, j, k + 2]]);
                        } else if (k === seats[i][j].length - 4) {
                            patternQueues[3].push([[i, j, k], [i, j, k + 1], [i, j, k + 2], [i, j, k + 3]]);
                        } else {
                            patternQueues[4].push([[i, j, k], [i, j, k + 1], [i, j, k + 2], [i, j, k + 3], [i, j, k + 4]]);
                        }
                    }
                    break;

            }
        }
    }
    return patternQueues;
}

function assignSeat(count, queues) {
    var minPattern = 0, maxPattern = 0, i, pattern, newPattern = [], assignedPattern = [];
    if (queues[count - 1].length > 0) {
        return queues[count - 1].shift();
    } else {
        for (i = count; i < queues.length; i++) {
            if (i !== count - 1) {
                if (queues[i].length && queues[i].length < queues[minPattern].length) {
                    minPattern = i;
                }
                if (queues[i].length && queues[i].length >= queues[maxPattern].length) {
                    maxPattern = i;
                }
            }
        }
        console.log(maxPattern, minPattern);
        if (queues[maxPattern].length === 0) {
            return null;
        }
        if (maxPattern < count - 1) {
            if (queues[maxPattern].length < Math.ceil(count / (maxPattern + 1))) {
                return null;
            } else {
                i = 0;
                while (i < Math.ceil(count / (maxPattern + 1))) {
                    pattern = queues[maxPattern].shift();
                    newPattern = pattern.concat(newPattern);
                    i++;
                }
            }
        } else {
            newPattern = queues[maxPattern].shift();
        }

        for (i = 0; i < count; i++) {
            assignedPattern.push(newPattern.shift());
        }
        if (newPattern.length > 0) {
            queues[newPattern.length - 1].push(newPattern);
        }
        return assignedPattern;
    }
}
function formatSeat(seat) {
    var i, formated = [];
    if (seat) {
        for (i = 0; i < seat.length; i++) {
            formated[i] = ['A', 'B', 'C', 'D'][seat[i][0]] + '区 ' + (seat[i][1] + 1) + '排' + (seat[i][2] + 1) + '座';
        }
        return formated.join('; ')
    } else {
        return null
    }
}
seats = initSeatsData();
queues = devideSeatsPattern(seats);

//queues[0] = [];
//queues[1] = [];
//queues[2] = [];
//queues[3] = [];
//queues[4] = [];
//console.log(assignSeat(2, queues));

/* GET users listing. */
router.get('/', function (req, res, next) {
    //console.log(req);
    var formatedSeat = formatSeat(assignSeat(req.query.ticketCount, queues));
    if(formatedSeat) {
        res.send('您的座位是 ' + formatedSeat);
    } else {
        res.send('抱歉已无座！');
    }
    //res.send('Your seats is ' + assignSeat(req.query.ticketCount, queues));
});

module.exports = router;
