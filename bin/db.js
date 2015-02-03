var cc          = require('config-multipaas');
var level = require('level');
var Geo = require('level-geo');

var db = Geo(level('./db'));
var config      = cc({ 
  table_name : process.env.TABLE_NAME || process.env.OPENSHIFT_APP_NAME || 'parks'
})


var table_name  = config.get('table_name');
var points = require('../parkcoord.json');
var error_response = "data already exists - bypassing db initialization step\n";

function importMapPoints(err, rows, result) {
  if(err) {
    return console.error(error_response, err);
  }
  var insert = "Insert into "+table_name+" (name, the_geom) VALUES ";
  var qpoints = points.map(insertMapPinSQL).join(",");
  var query = insert + qpoints + ';';
  console.log(query);
  pg(query, function(err, rows, result) {
    if(err) {
      return console.error(error_response, err);
    }
    var response = 'Data import completed!';
    return response;
  });
};

function insertMapPinSQL(pin) {
  var query = '';
  var escape = /'/g
  
  if(typeof(pin) == 'object'){
    query = "('" + pin.Name.replace(/'/g,"''") + "', ST_GeomFromText('POINT(" + pin.pos[0] +" "+ pin.pos[1] + " )', 4326))";  
  }
  return query;
};

function init_db(){
  pg('CREATE EXTENSION postgis;', importMapPoints);
} 

function flush_db(){
  pg('DROP TABLE '+ table_name+';', function(err, rows, result){
    var response = 'Database dropped!';
    console.log(response);
    return response;
  });
} 

function select_box(req, res, next){
  //clean these variables:
  var query = req.query;
  var limit = (typeof(query.limit) !== "undefined") ? query.limit : 40;
  if(!(Number(query.lat1) 
    && Number(query.lon1) 
    && Number(query.lat2) 
    && Number(query.lon2)
    && Number(limit)))
  {
    res.send(500, {http_status:400,error_msg: "this endpoint requires two pair of lat, long coordinates: lat1 lon1 lat2 lon2\na query 'limit' parameter can be optionally specified as well."});
    return console.error('could not connect to postgres', err);
  }
  pg('SELECT gid,name,ST_X(the_geom) as lon,ST_Y(the_geom) as lat FROM ' + table_name+ ' t WHERE ST_Intersects( ST_MakeEnvelope('+query.lon1+", "+query.lat1+", "+query.lon2+", "+query.lat2+", 4326), t.the_geom) LIMIT "+limit+';', function(err, rows, result){
    if(err) {
      res.send(500, {http_status:500,error_msg: err})
      return console.error('error running query', err);
    }
    res.send(rows);
    return rows;
  })
};
function select_all(req, res, next){
  console.log(pg);
  pg('SELECT gid,name,ST_X(the_geom) as lon,ST_Y(the_geom) as lat FROM ' + table_name +';', function(err, rows, result) {
    console.log(config);
    if(err) {
      res.send(500, {http_status:500,error_msg: err})
      return console.error('error running query', err);
    }
    res.send(result);
    return rows;
  });
};

module.exports = exports = {
  selectAll: select_all,
  selectBox: select_box,
  flushDB:   flush_db,
  initDB:    init_db
};
