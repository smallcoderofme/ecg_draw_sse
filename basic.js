(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WF = {})));
}(this, (function (exports) { 'use strict';

	/*
	A、名称：限幅滤波法（又称程序判断滤波法）
	B、方法：
	    根据经验判断，确定两次采样允许的最大偏差值（设为A），
	    每次检测到新值时判断：
	    如果本次值与上次值之差<=A，则本次值有效，
	    如果本次值与上次值之差>A，则本次值无效，放弃本次值，用上次值代替本次值。
	C、优点：
	    能有效克服因偶然因素引起的脉冲干扰。
	D、缺点：
	    无法抑制那种周期性的干扰。
	    平滑度差。
	*/

	function LimitingFilter(limit) {
	    this.limit = limit || 1;
	    this.value;

	    this.filtering = function (value) {
	        if (this.value == undefined) this.value = value;

	        if (((value - this.value) <= this.limit) && ((this.value - value) <= this.limit)) this.value = value;

	        return this.value;
	    };
	}

	/*
	A、名称：中位值滤波法
	B、方法：
	    连续采样N次（N取奇数），把N次采样值按大小排列，
	    取中间值为本次有效值。
	C、优点：
	    能有效克服因偶然因素引起的波动干扰；
	    对温度、液位的变化缓慢的被测参数有良好的滤波效果。
	D、缺点：
	    对流量、速度等快速变化的参数不宜。
	*/

	function MedianFilter() {
	    this.filtering = function (values) {
	        var _len = values.length;

	        if (_len % 2 == 0) throw '传入的数组长度必须是奇数';

	        var _temp;
	        for (var j = 0; j < _len - 1; j++) {
	            for (var i = 0; i < _len - 1 - j; i++) {
	                if (values[i] > values[i + 1]) {
	                    _temp = values[i];
	                    values[i] = values[i + 1];
	                    values[i + 1] = _temp;
	                }
	            }
	        }

	        return values[(_len - 1) / 2];
	    };
	}

	/*
	A、名称：算术平均滤波法
	B、方法：
	    连续取N个采样值进行算术平均运算：
	    N值较大时：信号平滑度较高，但灵敏度较低；
	    N值较小时：信号平滑度较低，但灵敏度较高；
	    N值的选取：一般流量，N=12；压力：N=4。
	C、优点：
	    适用于对一般具有随机干扰的信号进行滤波；
	    这种信号的特点是有一个平均值，信号在某一数值范围附近上下波动。
	D、缺点：
	    对于测量速度较慢或要求数据计算速度较快的实时控制不适用；
	    比较浪费RAM。
	*/

	function ArithmeticAverageFilter() {
	    this.filtering = function (values) {
	        var _len = values.length;
	        var _sum = 0;
	        for (var i = 0; i < _len; i++) {
	            _sum += values[i];
	        }

	        return _sum / _len;
	    };
	}

	/*
	A、名称：递推平均滤波法（又称滑动平均滤波法）
	B、方法：
	    把连续取得的N个采样值看成一个队列，队列的长度固定为N，
	    每次采样到一个新数据放入队尾，并扔掉原来队首的一次数据（先进先出原则），
	    把队列中的N个数据进行算术平均运算，获得新的滤波结果。
	    N值的选取：流量，N=12；压力，N=4；液面，N=4-12；温度，N=1-4。
	C、优点：
	    对周期性干扰有良好的抑制作用，平滑度高；
	    适用于高频振荡的系统。
	D、缺点：
	    灵敏度低，对偶然出现的脉冲性干扰的抑制作用较差；
	    不易消除由于脉冲干扰所引起的采样值偏差；
	    不适用于脉冲干扰比较严重的场合；
	    比较浪费RAM。
	*/

	function AverageRecursiveFilter(length) {
	    this.length = length || 4;
	    this.values = [];

	    this.filtering = function (value) {
	        this.values.push(value);

	        var _len = this.values.length;
	        if (_len > this.length) {
	            this.values.shift();
	            _len = this.length;
	        }

	        var _sum = 0;
	        for (var i = 0; i < _len; i++) {
	            _sum += this.values[i];
	        }

	        return _sum / _len;
	    };
	}

	/*
	A、名称：中位值平均滤波法（又称防脉冲干扰平均滤波法）
	B、方法：
	    采一组队列去掉最大值和最小值后取平均值，
	    相当于“中位值滤波法”+“算术平均滤波法”。
	    连续采样N个数据，去掉一个最大值和一个最小值，
	    然后计算N-2个数据的算术平均值。
	    N值的选取：3-14。
	C、优点：
	    融合了“中位值滤波法”+“算术平均滤波法”两种滤波法的优点。
	    对于偶然出现的脉冲性干扰，可消除由其所引起的采样值偏差。
	    对周期干扰有良好的抑制作用。
	    平滑度高，适于高频振荡的系统。
	D、缺点：
	    计算速度较慢，和算术平均滤波法一样。
	    比较浪费RAM。
	*/

	function MedianAverageFilter(length) {
	    this.length = length || 4;
	    this.values = [];

	    this.filtering = function (value) {
	        this.values.push(value);

	        var _len = this.values.length;
	        if (_len > this.length) {
	            this.values.shift();
	            _len = this.length;
	        }

	        var _sum = 0, _min = this.values[0], _max = this.values[0];
	        for (var i = 0; i < _len; i++) {
	            var _value = this.values[i];
	            if (_value < _min) _min = _value;
	            if (_value > _max) _max = _value;
	            _sum += this.values[i];
	        }

	        if (_len > 2) {
	            _sum -= _min + _max;
	            return _sum / (_len - 2);
	        } else {
	            return _sum / _len;
	        }
	    };
	}

	/*
	A、名称：限幅平均滤波法
	B、方法：
	    相当于“限幅滤波法”+“递推平均滤波法”；
	    每次采样到的新数据先进行限幅处理，
	    再送入队列进行递推平均滤波处理。
	C、优点：
	    融合了两种滤波法的优点；
	    对于偶然出现的脉冲性干扰，可消除由于脉冲干扰所引起的采样值偏差。
	D、缺点：
	    比较浪费RAM。
	*/

	function LimitingAverageFilter(limit, length) {
	    this.length = length || 4;
	    this.limit = limit || 1;
	    this.values = [];

	    this.filtering = function (value) {
	        this.values.push(value);

	        var _len = this.values.length;
	        if (_len > this.length) {
	            this.values.shift();
	            _len = this.length;
	        }

	        if (_len > 1 && ((this.values[_len - 1] - this.values[_len - 2]) > this.limit) || ((this.values[_len - 2] - this.values[_len - 1]) > this.limit)) this.values[_len - 1] = this.values[_len - 2];

	        var _sum = 0;
	        for (var i = 0; i < _len; i++) {
	            _sum += this.values[i];
	        }

	        return _sum / _len;
	    };
	}

	/*
	A、名称：一阶滞后滤波法
	B、方法：
	    取a=0-1，本次滤波结果=(1-a)*本次采样值+a*上次滤波结果。
	C、优点：
	    对周期性干扰具有良好的抑制作用；
	    适用于波动频率较高的场合。
	D、缺点：
	    相位滞后，灵敏度低；
	    滞后程度取决于a值大小；
	    不能消除滤波频率高于采样频率1/2的干扰信号。
	*/

	function FirstOrderLagFilter(ratio) {
	    this.ratio = ratio || 0.5;
	    this.value;

	    this.filtering = function (value) {
	        if (this.value == undefined) this.value = value;

	        this.value = value * this.ratio + this.value * (1 - this.ratio);

	        return this.value;
	    };
	}

	/*
	A、名称：加权递推平均滤波法
	B、方法：
	    是对递推平均滤波法的改进，即不同时刻的数据加以不同的权；
	    通常是，越接近现时刻的数据，权取得越大。
	    给予新采样值的权系数越大，则灵敏度越高，但信号平滑度越低。
	C、优点：
	    适用于有较大纯滞后时间常数的对象，和采样周期较短的系统。
	D、缺点：
	    对于纯滞后时间常数较小、采样周期较长、变化缓慢的信号；
	    不能迅速反应系统当前所受干扰的严重程度，滤波效果差。
	*/

	function WeightedAverageRecursiveFilter(length) {
	    this.length = length || 4;
	    this.values = [];

	    this.filtering = function (value) {
	        this.values.push(value);

	        var _len = this.values.length;
	        if (_len > this.length) {
	            this.values.shift();
	            _len = this.length;
	        }

	        var _sum = 0;
	        var _sum2 = 0;
	        for (var i = 0; i < _len; i++) {
	            _sum += this.values[i] * (i + 1);
	            _sum2 += i + 1;
	        }

	        return _sum / _sum2;
	    };
	}

	/*
	A、名称：消抖滤波法
	B、方法：
	    设置一个滤波计数器，将每次采样值与当前有效值比较：
	    如果采样值=当前有效值，则计数器清零；
	    如果采样值<>当前有效值，则计数器+1，并判断计数器是否>=上限N（溢出）；
	    如果计数器溢出，则将本次值替换当前有效值，并清计数器。
	C、优点：
	    对于变化缓慢的被测参数有较好的滤波效果；
	    可避免在临界值附近控制器的反复开/关跳动或显示器上数值抖动。
	D、缺点：
	    对于快速变化的参数不宜；
	    如果在计数器溢出的那一次采样到的值恰好是干扰值,则会将干扰值当作有效值导入系统。
	*/

	function EliminateShakeFilter(length) {
	    this.length = length || 4;
	    this.count = 0;
	    this.value;

	    this.filtering = function (value) {
	        if (this.value == undefined) this.value = value;

	        if (this.value != value) {
	            this.count++;
	            if (this.count >= this.length) {
	                this.count = 0;
	                this.value = value;
	            }
	        } else {
	            this.count = 0;
	        }

	        return this.value;
	    };
	}

	/*
	A、名称：限幅消抖滤波法
	B、方法：
	    相当于“限幅滤波法”+“消抖滤波法”；
	    先限幅，后消抖。
	C、优点：
	    继承了“限幅”和“消抖”的优点；
	    改进了“消抖滤波法”中的某些缺陷，避免将干扰值导入系统。
	D、缺点：
	    对于快速变化的参数不宜。
	*/

	function LimitingEliminateShakeFilter(limit, length) {
	    this.limit = limit || 1;
	    this.length = length || 4;
	    this.count = 0;
	    this.value;

	    this.filtering = function (value) {
	        if (this.value == undefined) this.value = value;

	        if (((value - this.value) > this.limit) || ((this.value - value) > this.limit)) value = this.value;

	        if (this.value != value) {
	            this.count++;
	            if (this.count >= this.length) {
	                this.count = 0;
	                this.value = value;
	            }
	        } else {
	            this.count = 0;
	        }

	        return this.value;
	    };
	}

	exports.LimitingFilter = LimitingFilter;
	exports.MedianFilter = MedianFilter;
	exports.ArithmeticAverageFilter = ArithmeticAverageFilter;
	exports.AverageRecursiveFilter = AverageRecursiveFilter;
	exports.MedianAverageFilter = MedianAverageFilter;
	exports.LimitingAverageFilter = LimitingAverageFilter;
	exports.FirstOrderLagFilter = FirstOrderLagFilter;
	exports.WeightedAverageRecursiveFilter = WeightedAverageRecursiveFilter;
	exports.EliminateShakeFilter = EliminateShakeFilter;
	exports.LimitingEliminateShakeFilter = LimitingEliminateShakeFilter;

	Object.defineProperty(exports, '__esModule', { value: true });

})));