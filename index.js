import{a as O}from"./assets/vendor-C19taMLP.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function o(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=o(r);fetch(r.href,n)}})();const A={GM_API_KEY:void 0};(e=>{var t,o,s,r="The Google Maps JavaScript API",n="google",i="importLibrary",c="__ib__",l=document,d=window;d=d[n]||(d[n]={});var u=d.maps||(d.maps={}),b=new Set,p=new URLSearchParams,B=()=>t||(t=new Promise(async(g,y)=>{await(o=l.createElement("script")),p.set("libraries",[...b]+"");for(s in e)p.set(s.replace(/[A-Z]/g,N=>"_"+N[0].toLowerCase()),e[s]);p.set("callback",n+".maps."+c),o.src=`https://maps.${n}apis.com/maps/api/js?`+p,u[c]=g,o.onerror=()=>t=y(Error(r+" could not load.")),o.nonce=l.querySelector("script[nonce]")?.nonce||"",l.head.append(o)}));u[i]?console.warn(r+" only loads once. Ignoring:",e):u[i]=(g,...y)=>b.add(g)&&B().then(()=>u[i](g,...y))})({key:A.GM_API_KEY,v:"weekly"});const m={mapArea:document.getElementById("map"),resizer:document.querySelector(".resizer"),randomBtn:document.getElementById("btn-random-place"),findMeBtn:document.getElementById("btn-my-coordinate"),addMarkerBtn:document.getElementById("btn-add-marker")};function T(e){const r=Math.floor(e/86400),n=Math.floor(e%86400/3600),i=Math.floor(e%3600/60),c=e%60;return{days:r,hours:n,minutes:i,seconds:c}}function L(e,t){return Math.random()*(t-e)+e}function _(e){return JSON.stringify(e)}function q(e){try{return JSON.parse(e)}catch(t){console.log("Parse error :",t)}}function R(e,t){localStorage.setItem(e,_(t))}function x(e){return q(localStorage.getItem(e))}const E=m.resizer.previousElementSibling;let w=!1;m.resizer.addEventListener("mousedown",e=>{w=!0,document.addEventListener("mousemove",C),document.addEventListener("mouseup",S)});function C(e){if(!w)return;let t=e.clientX-E.getBoundingClientRect().left;E.style.width=`${t}px`}function S(){w=!1,document.removeEventListener("mousemove",C),document.removeEventListener("mouseup",S)}let a={},P=!1;async function G(){if(P)return;P=!0,console.trace("Init App");const{map:e,marker:t,infoWindow:o}=await Z(await M());a={map:e,marker:t,infoWindow:o},m.randomBtn.addEventListener("click",K),m.findMeBtn.addEventListener("click",U)}G();let h=[];async function v(e,t,o,s=void 0){const{AdvancedMarkerElement:r,PinElement:n}=await google.maps.importLibrary("marker");let i;if(s){const l=document.createElement("img");l.src=s,i=new n({glyph:l})}const c=new r({map:a.map,position:e,gmpDraggable:t,gmpClickable:!0,content:i?.element,title:o});return c.addListener("dragstart",()=>{a.infoWindow.close()}),c.addListener("dragend",()=>k(c)),c.addListener("gmp-click",()=>k(c)),console.log("Init Marker"),c}function D(e,t){e.position=t}function f(e,t){a.infoWindow.close(),a.infoWindow.setContent(t),a.infoWindow.open(e.map,e)}function $(){const e=x("user-markers");!e||e.length===0||(h=e,h.forEach(t=>{v(t,!1,"User saved marker")}),console.log("Init SavedMarkers"))}async function z(e,t){const o="https://routes.googleapis.com/directions/v2:computeRoutes",s={origin:{location:{latLng:{latitude:e.lat,longitude:e.lng}}},destination:{location:{latLng:{latitude:t.lat,longitude:t.lng}}},travelMode:"WALK",computeAlternativeRoutes:!1,routeModifiers:{avoidTolls:!1,avoidHighways:!1,avoidFerries:!1},languageCode:"en-US",units:"IMPERIAL"},r={headers:{"Content-Type":"application/json","X-Goog-Api-Key":A.GM_API_KEY,"X-Goog-FieldMask":"routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"}};try{return(await O.post(o,s,r)).data}catch(n){throw console.error("Помилка отримання маршруту:",n.response?.data||n.message),n}}async function F(e){await google.maps.importLibrary("geometry");const t=google.maps.geometry.encoding.decodePath(e);new google.maps.Polyline({path:t,geodesic:!0,strokeColor:"#FF0000",strokeOpacity:1,strokeWeight:4}).setMap(a.map)}function K(){const e=H();a.map.setCenter(e),D(a.marker,e)}async function U(){await W(),a.map.setZoom(15)}function j(e,t){a.infoWindow.setPosition(t),a.infoWindow.setContent("Error: The Geolocation service failed."),a.infoWindow.open(a.map)}async function k(e){const t=e.position;let o=`<p>Pin dropped at: ${t.lat}, ${t.lng}</p>`,s=null;f(e,'<div class="loader"></div>');try{const r=await M(),n=await z(r,t);if(!n.routes||n.routes.length===0)o+="<b>No routes found</b>",f(e,o);else{const i=n.routes[0],c=i.distanceMeters>1e3?i.distanceMeters/1e3:i.distanceMeters,{days:l,hours:d,minutes:u}=T(Number.parseInt(i.duration));s=i.polyline?.encodedPolyline||null,o+=`<p>Approximate route length: ${c} ${c>1e3?"km":"m"}</p>
  			<p>Approximate route time: ${l} d., ${d} h., ${u} min. </p>`,s?o+='<button id="btn-draw-route" type="button">Draw route</button>':o+="<b>No route polyline found</b>"}f(e,o),google.maps.event.addListenerOnce(a.infoWindow,"domready",()=>{const i=document.getElementById("btn-draw-route");i&&i.addEventListener("click",()=>{s?F(s):console.error("Cannot draw route: No encoded polyline available.")})})}catch(r){console.error("Error fetching route:",r),o+="<b>Error retrieving route data</b>",await W(),f(e,o)}}async function Y(e,t){const o=e.latLng;v(o,!0,"New User Marker"),t.push(o),R("user-markers",t)}const J="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20height='24px'%20viewBox='0%20-960%20960%20960'%20width='24px'%20fill='%23e3e3e3'%3e%3cpath%20d='M360-80v-529q-91-24-145.5-100.5T160-880h80q0%2083%2053.5%20141.5T430-680h100q30%200%2056%2011t47%2032l181%20181-56%2056-158-158v478h-80v-240h-80v240h-80Zm120-640q-33%200-56.5-23.5T400-800q0-33%2023.5-56.5T480-880q33%200%2056.5%2023.5T560-800q0%2033-23.5%2056.5T480-720Z'/%3e%3c/svg%3e";let I=!1;async function Z(e={lat:-25.344,lng:131.031}){if(I)return a;I=!0;const{Map:t,InfoWindow:o}=await google.maps.importLibrary("maps"),s=await new t(m.mapArea,{zoom:5,center:e,mapId:"DEMO_MAP_ID"}),r=await v(e,!0,"Your location",J),n=new o;return $(),s.addListener("click",i=>{Y(i,h)}),console.log("Init Map"),{map:s,marker:r,infoWindow:n}}async function W(){try{const e=await M();a.infoWindow.setPosition(e),a.infoWindow.setContent("Your current location"),a.infoWindow.open(map),a.map.setCenter(e)}catch{j(!0,a.infoWindow,map.getCenter())}}async function M(){return new Promise((e,t)=>{if(!navigator.geolocation){reject(new Error("Geolocation is not supported by this browser."));return}navigator.geolocation.getCurrentPosition(o=>e({lat:o.coords.latitude,lng:o.coords.longitude}),o=>t(o),{enableHighAccuracy:!0,timeout:5e3,maximumAge:0})})}function H(){return{lat:Number(L(-64.05,85.05)),lng:Number(L(-180,180))}}
//# sourceMappingURL=index.js.map
