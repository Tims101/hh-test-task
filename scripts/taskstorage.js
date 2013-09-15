var TaskStorage = function() {
	var self = this;

	var key = 'hh-calendar-tasks';
	var localStorage = window.localStorage;

	self.actualData = null;

	self.init = function() {
		if (!self.actualData) {
			try {
				var d = localStorage.getItem(key);
				if (d){
					self.actualData = JSON.parse(d);
				} else {
					self.actualData = {};
				}				
			} catch (e) {
				self.actualData = {};
			}
		}
	};

	self.save = function(data, day, month, year){
		if (!localStorage) return false;

		self.init();

		if (!self.actualData[year]) self.actualData[year] = {};
		if (!self.actualData[year][month]) self.actualData[year][month] = {};
		
		self.actualData[year][month][day] = data;

		localStorage.setItem(key, JSON.stringify(self.actualData));
	};

	self.remove = function(day, month, year){
		if (!localStorage) return false;

		self.save(null, day, month, year);		
	};

	self.get = function(day, month, year){
		if (!localStorage) return false;

		self.init();

		if (!self.actualData[year]) return null;
		if (!self.actualData[year][month]) return null;
		if (!self.actualData[year][month][day]) return null;

		return self.actualData[year][month][day];				
	};
};