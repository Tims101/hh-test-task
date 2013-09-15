var CalendarGui = function(options, model){
	var self = this;

	self.container = options.container;
	self.gridElements = [];

	self.selectedDay = null;
	self.data = null;

	self.model = model;

	self.mainPopover = new MainPopover(options.mainPopover);
	self.monthComponent = new MonthComponent(options.monthComponent);
	self.fastTaskAddingPopover = new FastTaskAddingPopoverComponent(options.fastTaskAddingPopover);

	self.initGui = function() {
		for (var i = 0; i < 6; i++) {
			var tr = document.createElement('tr');
			for (var j = 0; j < 7; j++) {
				var td = document.createElement('td');	

				var day = document.createElement('div');
				day.className = 'day';
				td.appendChild(day);

				var task = document.createElement('div');
				task.className = 'task';
				td.appendChild(task);

				var participants = document.createElement('div');
				participants.className = 'participants';
				td.appendChild(participants);				

				var element = {
					cell: td,
					day: day,
					task: task,
					participants: participants
				};

				self.gridElements.push(element);

				td.onmousedown = function() { 
					self.showMainPopover(this);
				};

				tr.appendChild(td);
			}	
			self.container.appendChild(tr);
		}
	};

	self.showMainPopover = function(element){	
		self.mainPopover.show(element);
	};

	self.mapDataOnGrid = function(data, selectedDay){		
		self.data = data;
		self.selectedDay = selectedDay;

		var days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

		if (!self.selectedDay) self.selectedDay = new Date();

		if (data.length != 42){
			// hide last tr
			addClass(self.gridElements[self.gridElements.length - 1].cell.parentNode, "hide");
		} else {			
			removeClass(self.gridElements[self.gridElements.length - 1].cell.parentNode, "hide");
		}

		for (var i = 0, length = data.length; i < length; i++){
			self.gridElements[i].cell.calendarData = data[i];	
			if (i < 7) {
				setElementDay(self.gridElements[i], days[i] + ', ' + data[i].day);				
			} else {			
				setElementDay(self.gridElements[i], data[i].day);
			}

			if (data[i].data) {
				setElementTask(self.gridElements[i], data[i].data.task, data[i].data.participants);
			} else {
				setElementTask(self.gridElements[i], null, null);
			}

			removeClass(self.gridElements[i].cell, "today");

			if (data[i].day == self.selectedDay.getDate() && data[i].month == self.selectedDay.getMonth()
				&& data[i].year == self.selectedDay.getFullYear()){
				addClass(self.gridElements[i].cell, "today");
			} 
		}

		self.mainPopover.hide();
	};

	self.addTask = function(task, participants, day, month, year, description){
		if (self.selectedDay.getFullYear() != year ||
			Math.abs(self.selectedDay.getMonth() - month) > 1) return;

			var index = -1;
			for (var i in self.data){
				var element = self.data[i];
				if (element.day == day && element.month == month) {
					index = i;
					break;
				}
			};	

			if (index < 0) return;
			setElementTask(self.gridElements[i], task, participants);
			self.gridElements[i].cell.calendarData = { day: day, month: month, year: year, data: { task: task, participants: participants, description: description }};

			self.mainPopover.reshow();
	};

	var setElementDay = function(element, text){
		element.day.innerText = text;
	};

	var setElementTask = function(element, task, participants){		
		if (!task) {
			removeClass(element.cell, "has-task");
		} else {
			addClass(element.cell, "has-task");
		}

		element.task.innerText = task ? task : '';
		element.participants.innerText = participants ? participants : '';
	};	

	options.mainPopover.createCallback = function(task, participants, day, month, year, description){
		if (!task || task.trim() == "") return;

		self.model.addTask(task, participants, day, month, year, description);
	};

	options.mainPopover.deleteCallback = function(day, month, year){
		self.model.deleteTask(day, month, year);
	};

	options.monthComponent.callback = function(val){
		self.mapDataOnGrid(self.model.getDaysOnPage(val));		
	};

	options.fastTaskAddingPopover.callback = function(s){
		return self.model.tryParseAndStoreFastTask(s);
	};
};