var MonthComponent = function(options){
	var self = this;

	var month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

	self.container = options.container;

	self.date = options.date || new Date() ;

	var prevMonthBtn = self.container.querySelector("#previous-month");
	var currentMonthParagraph = self.container.querySelector("#current-month");
	var nextMonthBtn = self.container.querySelector("#next-month");
	var todayBtn = self.container.querySelector("#today");

	currentMonthParagraph.innerText = month[self.date.getMonth()] + ' ' + self.date.getFullYear();

	var setDate = function(val){
		self.date = val;

		currentMonthParagraph.innerText = month[val.getMonth()] + ' ' + val.getFullYear();

		if (options.callback){
			options.callback(val);
		}
	};

	self.bind = function(){
		prevMonthBtn.onclick = function(){
			setDate(new Date(self.date.getFullYear(), self.date.getMonth() - 1));
		};

		nextMonthBtn.onclick = function(){
			setDate(new Date(self.date.getFullYear(), self.date.getMonth() + 1));
		};		

		todayBtn.onclick = function(){
			setDate(new Date());
		};
	};	

	self.bind();
};