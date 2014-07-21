var request = require("request");
var _ = require('underscore');
var querystring = require('querystring');
var crypto = require('crypto');

var host = "http://maps.googleapis.com";

var sanitize = function (string) {

    /* Based on RFC 4648's "base64url" mapping:
    http://tools.ietf.org/html/rfc4648#section-5 */

    return string.replace(/\+/g, '-')
      .replace(/\//g, '_');
};

exports.generate_signature = function ( path, crypto_key ) {
  var decoded_key = new Buffer(sanitize(crypto_key), "base64");
  var signature = crypto.createHmac("sha1", decoded_key).update(path);

  return sanitize(signature.digest("base64"));
};

exports.geocode = function ( providerOpts, loc, cbk, opts) {

  var uri = "/maps/api/geocode/json";

  var options = _.extend({sensor: false, address: loc}, opts || {});

  if ( options.client && options.crypto_key ) {
    var url_to_sign = uri + '?' + querystring.stringify( options );
    options.signature = generate_signature( url_to_sign, options.crypto_key );
    delete options.crypto_key
  }

  request({
    uri: host + uri,
    qs:options
  }, function(err,resp,body) {
    if (err) return cbk(err);
    cbk(null,JSON.parse(body));
  });
};

exports.reverseGeocode = function ( providerOpts, lat, lng, cbk, opts ) {

  var uri = "/maps/api/geocode/json";

  var options = _.extend({sensor: false, latlng: lat + ',' + lng}, opts || {});

  request({
    uri: host + uri,
    qs:options
  }, function(err,resp,body) {
    if (err) return cbk(err);
    cbk(null,JSON.parse(body));
  });

};