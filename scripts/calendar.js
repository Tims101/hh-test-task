var Calendar = function(options){
	var self = this;

	self.container = options.container;

	self.gui = new CalendarGui(options, this);
	self.taskStorage = new TaskStorage();

	self.initCalendar = function(){
		self.gui.initGui();		
		self.gui.mapDataOnGrid(self.getDaysOnPage());	
	};		

	self.addTask = function(task, participants, day, month, year, description){
		if (!year) year = new Date().getFullYear();
		if (!description) description = null;
		self.taskStorage.save({ task: task, participants: participants, description: description } , day, month, year);

		self.gui.addTask(task, participants, day, month, year, description);
		return true;
	};

	self.deleteTask = function(day, month, year){
		if (!year) year = new Date().getFullYear();

		self.taskStorage.remove(day, month, year);
		self.gui.addTask(null, null, day, month, year);		
	};

	self.getDaysOnPage = function(date){	
		if (!date) date = new Date();

		var getInfoAboutMonth = function(year, month){			
			var firstDayOfMonth = new Date(year, month, 1);
			var daysInMonth = new Date(year, month + 1, 0).getDate();

			return {
				firstDayOnWeek: firstDayOfMonth.getDay(),
				daysInMonth: daysInMonth
			};
		};

		var result = [];

		var year = date.getFullYear();
		var month = date.getMonth(); 
		var today = date.getDate(); 

		var selectedMonthInfo = getInfoAboutMonth(year, month);

		for (var i = 1; i <= selectedMonthInfo.daysInMonth; i++)
		{
			result.push({
				day: i,
				month: month,
				year: year,
				data: self.taskStorage.get(i, month, year)
			});
		};

		var firstDayOnWeek = selectedMonthInfo.firstDayOnWeek;
		firstDayOnWeek = firstDayOnWeek ? firstDayOnWeek : 7;

		var previousMonthInfo = getInfoAboutMonth(year, month - 1);

		var daysInPreviousMonth = previousMonthInfo.daysInMonth;

		var isPreviousYear = month - 1 == 0;

		var m = isPreviousYear ?  11 : month - 1;
		var y = isPreviousYear ? year - 1 : year;	

		while (--firstDayOnWeek > 0)
		{
			result.unshift({
				day: daysInPreviousMonth,
				month: m,
				year: y,
				data: self.taskStorage.get(daysInPreviousMonth, m, y)
			});

			--daysInPreviousMonth;
		}

		var len = 42 - result.length;

		if (len >= 7){
			len -= 7; 
		}

		var isNewYear = month + 1 == 12;

		var i = 0;

		var m = isNewYear ? 0 : month + 1;
		var y = isNewYear ? year + 1: year;

		while (len-- > 0){
			result.push({
				day: ++i,
				month: m,
				year: y,
				task: self.taskStorage.get(i, m, y)
			});
		}

		return result;
	};

	self.tryParseAndStoreFastTask = function(s){
		var months = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]

		var splitted = s.match(/^([^,]*?),(.*)$/);
		if (!s) return false;
		splitted.shift();

		if (splitted.length != 2) return false;

		var day = parseInt(splitted[0]);		
		var tryMonth = splitted[0].split(' ');

		if (tryMonth.length == 2){
			var month = months.indexOf(tryMonth[1].substring(0, 3).toLowerCase().trim()); 
		} else {
			return false;
		}

		if (month < 0) return false;
		

		var task = splitted[1];		

		if (!task) return;
		
		return self.addTask(task.trim(), null, day, month, null);
	};
};