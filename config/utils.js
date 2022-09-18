module.exports = {
    HandleResponseV1 (error, data, res) {
        if (error) {
            res.status(400).json({ error }).end()
        } else {
            res.send(data)
        }
    },
    HandleResponse (res, error, data, message) {
        if (error) {
            res.status(400).json({ success: false, data: data, message: message, error: error }).end()
        } else {
            res.send({ success: true, data: data, message: message, error: null })
        }
    },
    RandomString(length) {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    },
    RandomNumber(length) {
        const chars = '0123456789';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    },

    // alert(calcCrow(59.3293371,13.4877472,59.3225525,13.4619422).toFixed(1));
    // This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    GetLatLonDistance(lat1, lon1, lat2, lon2) {
      var R = 6371; // km
      var dLat = this.toRad(lat2-lat1);
      var dLon = this.toRad(lon2-lon1);
      var lat1 = this.toRad(lat1);
      var lat2 = this.toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    },
    toRad(Value) {
        return Value * Math.PI / 180;
    }, // Converts numeric degrees to radians
    GetTodaysDate() {
        var today = new Date();
        var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        return dateTime
    },
}