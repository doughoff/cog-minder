import{a as Ye,i as Ze,d as ne,e as Ie,p as q,h as R,I as Q,f as ce,j as Je,k as Qe,m as Xe,o as Ke,q as V,r as $e}from"./common-BJ5vf-Kh.js";/* empty css              */import{j as et,c as tt,a as nt,r as pe,s as rt,t as me,d as ot,g as at,b as De}from"./commonJquery-7AX1KuXJ.js";import"./bootstrap-select-_FR9htMb.js";import{i as it}from"./items-_Njqek5x.js";import{v as st,g as lt}from"./simulatorCalcs-xhiYYy_S.js";var Pe={exports:{}};Pe.exports;(function(o){var ue=function(){var a=String.fromCharCode,B="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",X="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",$={};function ie(c,p){if(!$[c]){$[c]={};for(var v=0;v<c.length;v++)$[c][c.charAt(v)]=v}return $[c][p]}var T={compressToBase64:function(c){if(c==null)return"";var p=T._compress(c,6,function(v){return B.charAt(v)});switch(p.length%4){default:case 0:return p;case 1:return p+"===";case 2:return p+"==";case 3:return p+"="}},decompressFromBase64:function(c){return c==null?"":c==""?null:T._decompress(c.length,32,function(p){return ie(B,c.charAt(p))})},compressToUTF16:function(c){return c==null?"":T._compress(c,15,function(p){return a(p+32)})+" "},decompressFromUTF16:function(c){return c==null?"":c==""?null:T._decompress(c.length,16384,function(p){return c.charCodeAt(p)-32})},compressToUint8Array:function(c){for(var p=T.compress(c),v=new Uint8Array(p.length*2),g=0,f=p.length;g<f;g++){var H=p.charCodeAt(g);v[g*2]=H>>>8,v[g*2+1]=H%256}return v},decompressFromUint8Array:function(c){if(c==null)return T.decompress(c);for(var p=new Array(c.length/2),v=0,g=p.length;v<g;v++)p[v]=c[v*2]*256+c[v*2+1];var f=[];return p.forEach(function(H){f.push(a(H))}),T.decompress(f.join(""))},compressToEncodedURIComponent:function(c){return c==null?"":T._compress(c,6,function(p){return X.charAt(p)})},decompressFromEncodedURIComponent:function(c){return c==null?"":c==""?null:(c=c.replace(/ /g,"+"),T._decompress(c.length,32,function(p){return ie(X,c.charAt(p))}))},compress:function(c){return T._compress(c,16,function(p){return a(p)})},_compress:function(c,p,v){if(c==null)return"";var g,f,H={},W={},F="",Y="",x="",D=2,S=3,M=2,m=[],i=0,y=0,d;for(d=0;d<c.length;d+=1)if(F=c.charAt(d),Object.prototype.hasOwnProperty.call(H,F)||(H[F]=S++,W[F]=!0),Y=x+F,Object.prototype.hasOwnProperty.call(H,Y))x=Y;else{if(Object.prototype.hasOwnProperty.call(W,x)){if(x.charCodeAt(0)<256){for(g=0;g<M;g++)i=i<<1,y==p-1?(y=0,m.push(v(i)),i=0):y++;for(f=x.charCodeAt(0),g=0;g<8;g++)i=i<<1|f&1,y==p-1?(y=0,m.push(v(i)),i=0):y++,f=f>>1}else{for(f=1,g=0;g<M;g++)i=i<<1|f,y==p-1?(y=0,m.push(v(i)),i=0):y++,f=0;for(f=x.charCodeAt(0),g=0;g<16;g++)i=i<<1|f&1,y==p-1?(y=0,m.push(v(i)),i=0):y++,f=f>>1}D--,D==0&&(D=Math.pow(2,M),M++),delete W[x]}else for(f=H[x],g=0;g<M;g++)i=i<<1|f&1,y==p-1?(y=0,m.push(v(i)),i=0):y++,f=f>>1;D--,D==0&&(D=Math.pow(2,M),M++),H[Y]=S++,x=String(F)}if(x!==""){if(Object.prototype.hasOwnProperty.call(W,x)){if(x.charCodeAt(0)<256){for(g=0;g<M;g++)i=i<<1,y==p-1?(y=0,m.push(v(i)),i=0):y++;for(f=x.charCodeAt(0),g=0;g<8;g++)i=i<<1|f&1,y==p-1?(y=0,m.push(v(i)),i=0):y++,f=f>>1}else{for(f=1,g=0;g<M;g++)i=i<<1|f,y==p-1?(y=0,m.push(v(i)),i=0):y++,f=0;for(f=x.charCodeAt(0),g=0;g<16;g++)i=i<<1|f&1,y==p-1?(y=0,m.push(v(i)),i=0):y++,f=f>>1}D--,D==0&&(D=Math.pow(2,M),M++),delete W[x]}else for(f=H[x],g=0;g<M;g++)i=i<<1|f&1,y==p-1?(y=0,m.push(v(i)),i=0):y++,f=f>>1;D--,D==0&&(D=Math.pow(2,M),M++)}for(f=2,g=0;g<M;g++)i=i<<1|f&1,y==p-1?(y=0,m.push(v(i)),i=0):y++,f=f>>1;for(;;)if(i=i<<1,y==p-1){m.push(v(i));break}else y++;return m.join("")},decompress:function(c){return c==null?"":c==""?null:T._decompress(c.length,32768,function(p){return c.charCodeAt(p)})},_decompress:function(c,p,v){var g=[],f=4,H=4,W=3,F="",Y=[],x,D,S,M,m,i,y,d={val:v(0),position:p,index:1};for(x=0;x<3;x+=1)g[x]=x;for(S=0,m=Math.pow(2,2),i=1;i!=m;)M=d.val&d.position,d.position>>=1,d.position==0&&(d.position=p,d.val=v(d.index++)),S|=(M>0?1:0)*i,i<<=1;switch(S){case 0:for(S=0,m=Math.pow(2,8),i=1;i!=m;)M=d.val&d.position,d.position>>=1,d.position==0&&(d.position=p,d.val=v(d.index++)),S|=(M>0?1:0)*i,i<<=1;y=a(S);break;case 1:for(S=0,m=Math.pow(2,16),i=1;i!=m;)M=d.val&d.position,d.position>>=1,d.position==0&&(d.position=p,d.val=v(d.index++)),S|=(M>0?1:0)*i,i<<=1;y=a(S);break;case 2:return""}for(g[3]=y,D=y,Y.push(y);;){if(d.index>c)return"";for(S=0,m=Math.pow(2,W),i=1;i!=m;)M=d.val&d.position,d.position>>=1,d.position==0&&(d.position=p,d.val=v(d.index++)),S|=(M>0?1:0)*i,i<<=1;switch(y=S){case 0:for(S=0,m=Math.pow(2,8),i=1;i!=m;)M=d.val&d.position,d.position>>=1,d.position==0&&(d.position=p,d.val=v(d.index++)),S|=(M>0?1:0)*i,i<<=1;g[H++]=a(S),y=H-1,f--;break;case 1:for(S=0,m=Math.pow(2,16),i=1;i!=m;)M=d.val&d.position,d.position>>=1,d.position==0&&(d.position=p,d.val=v(d.index++)),S|=(M>0?1:0)*i,i<<=1;g[H++]=a(S),y=H-1,f--;break;case 2:return Y.join("")}if(f==0&&(f=Math.pow(2,W),W++),g[y])F=g[y];else if(y===H)F=D+D.charAt(0);else return null;Y.push(F),g[H++]=D+F.charAt(0),f--,D=F,f==0&&(f=Math.pow(2,W),W++)}}};return T}();o!=null&&(o.exports=ue)})(Pe);var ct=Pe.exports;const He=Ye(ct),pt=et.noConflict();pt(function(o){o(()=>W());const ue={Default:"#162416",EnergyConsumption:"#000073",EnergyGen:"#004a4a",HeatDissipation:"#5b5b00",HeatGen:"#633200",MassSupport:"#5b5b00",Mass:"#493e2e",Vulnerability:"#d90000"};let a,B;const X=[{labelId:"powerLabel",id:"powerContainer",slot:"Power"},{labelId:"propulsionLabel",id:"propulsionContainer",slot:"Propulsion"},{labelId:"utilityLabel",id:"utilityContainer",slot:"Utility"},{labelId:"weaponLabel",id:"weaponContainer",slot:"Weapon"}],$=[[{name:"Ion Engine"}],[{name:"Aluminum Leg",number:2}],[{name:"Sml. Storage Unit"}],[{name:"Assault Rifle"},{name:"Med. Laser"}]];function ie(t,r){const s=o("#"+t.id),n=at(),l=[];Object.keys(ne).forEach(k=>{const G=ne[k];G.slot===t.slot&&Qe(G,n)&&l.push(G.name)}),l.sort(Xe);const u=l.map(k=>`<option>${k}</option>`).join(),I=o('<div class="row mt-1 align-items-center"></div>'),L=o('<div class="col"></div>'),A=o('<div class="input-group"></div>'),P=o('<div class="col-3"></div>'),N=o(`<select class="selectpicker" data-live-search="true">${u}</select>`),_=o('<button class="btn part-help-btn" data-html=true data-toggle="popover">?</button>'),O=o('<div class="input-group-prepend ml-3" data-toggle="tooltip" title="How many of the part to equip"></div>'),z=o('<span class="input-group-text">Number</span>'),w=o('<input type="text" class="form-control" placeholder="1" />'),b=o('<div class="btn-group btn-group-toggle ml-2" data-toggle="buttons"></div>'),K=o('<div class="input-group-prepend" data-toggle="tooltip" title="Whether the part is active."></div>'),re=o('<span class="input-group-text">Active</span>'),Z=o('<label class="btn active"><input type="radio" checked name="options">Yes</input></label>'),j=o('<label class="btn"><input type="radio" name="options">No</input></label>'),U=o('<button class="btn ml-2" data-toggle="tooltip" title="Removes the part.">X</button>');s.append(I[0]),I.append(L[0]),I.append(P[0]),L.append(A[0]),A.append(N[0]),A.append(_[0]),A.append(O[0]),O.append(z[0]),A.append(w[0]),A.append(b[0]),b.append(K[0]),K.append(re[0]),b.append(Z[0]),b.append(j[0]),A.append(U[0]),pe(b),U.on("click",()=>{I.next().length===0&&ie(t,""),N.selectpicker("destroy"),U.tooltip("dispose"),I.remove(),m()}),b.find("input").on("change",()=>{m()}),w.on("input",()=>{m()}),N.selectpicker("val",r);const E=k=>{let G;k in ne&&(G=ne[k],_.attr("data-content",$e(G)),_.popover(),m())};E(r),N.on("changed.bs.select",()=>{I.next().length===0&&ie(t,""),E(N.selectpicker("val"))}),N.parent().addClass("part-dropdown"),U.tooltip(),A.find(".btn-light").removeClass("btn-light")}function T(t,r,s,n){c(t,r,s,s.toFixed(1)+"%",n)}function c(t,r,s,n,l){const u=Number.isInteger(r)?r.toString():r.toFixed(1),I=r===0?r:`${u} ${n}`,L=o('<div class="percentage-bar-container"></div>'),A=o(`<span class="percentage-bar-text ml-1">${I}</span>`),P=o('<div class="percentage-bar-inner"></div>');P.css("background-color",ue[l]);const N=s>100?"100.0":s;P.width(`${N}%`),L.append(A[0]),L.append(P[0]),t.append(L[0])}function p(){const t=Math.abs(q(o("#depthInput").val(),10));return Math.max(1,Math.min(10,t))}function v(t){return t=t.sort((r,s)=>s-r).splice(0,2),[t[0]===void 0?0:t[0],t[1]===void 0?0:t[1]]}const g={partInfoCoverage:"Coverage",partInfoEnergyPerMove:"Energy/Move",partInfoEnergyPerTurn:"Energy/Turn",partInfoEnergyPerVolley:"Energy/Volley",partInfoHeatPerMove:"Heat/Move",partInfoHeatPerTurn:"Heat/Turn",partInfoHeatPerVolley:"Heat/Volley",partInfoIntegrity:"Integrity",partInfoMass:"Mass",partInfoVulnerability:"Vulnerability"};function f(){let t=De(o("#infoTypeContainer"));return(t===void 0||t=="")&&(pe(o("#infoTypeContainer")),t=De(o("#infoTypeContainer"))),g[t]}function H(){const t=[];X.map(A=>A.id).forEach(A=>{const P=[];o("#"+A).find(".input-group").each((N,_)=>{const O=o(_),z=O.find("label:first").hasClass("active"),w=Math.max(1,q(O.children("input").val(),1)),b=O.find("select").selectpicker("val");b in ne&&P.push({active:z?void 0:!1,number:w===1?void 0:w,name:b})}),t.push(P)});const r=o("#depthInput").val(),s=o("#energyGenInput").val(),n=o("#heatDissipationInput").val(),l={b11:!1,depth:q(r,void 0),energyGen:q(s,void 0),heatDissipation:q(n,void 0),parts:t},u=JSON.stringify(l),I=He.compressToEncodedURIComponent(u),L=window.location.origin+window.location.pathname+"#"+I;navigator.clipboard.writeText(L)}function W(){tt("Build",o("#headerContainer")),nt(o(document)),pe(o("#infoTypeContainer")),Y(),D(),F(),o("#spoilerDropdown > button").on("click",t=>{const r=o(t.target).text();o("#spoilers").text(r),rt(r),o("#spoilerDropdown > button").tooltip("hide"),M($,null,null,null)}),o("#reset").on("click",()=>{o("#reset").tooltip("hide"),M($,null,null,null)}),o("#depthInput").on("input",m),o("#energyGenInput").on("input",m),o("#heatDissipationInput").on("input",m),o("#infoTypeContainer > label > input").on("change",t=>{o(t.target).parent().tooltip("hide"),i()}),o("#getLinkButton").on("click",t=>{H();const r=o(t.target);r.tooltip("hide"),me(r,"Copied","Copy Build Link",2e3)}),o(window).on("click",t=>{const r=o(t.target).parents(".popover").length!=0;r?o(t.target).trigger("blur"):!r&&o(".popover").length>=1&&o('[data-toggle="popover"]').not(t.target).popover("hide")}),o(window).on("hashchange",()=>{D(),S(B.parts)}),o('[data-toggle="tooltip"]').tooltip()}async function F(){o("#beta11Checkbox").prop("checked",B.b11),await Ze(it,void 0),x(),M(B.parts,B.depth,B.energyGen,B.heatDissipation),B.depth!==void 0&&o("#depthInput").val(B.depth),B.energyGen!==void 0&&o("#energyGenInput").val(B.energyGen),B.heatDissipation!==void 0&&o("#heatDissipationInput").val(B.heatDissipation)}function Y(){const t=o("#importFromDumpButton");t.attr("data-content",`
<span class="input-label dump-input-label d-flex" data-toggle="tooltip"
title="Paste the entire a run dump or scores .txt file below">Paste run dump below</span>
<textarea id="dumpText" rows="10" class="form-control dump-input-textarea mt-3"></textarea>
<div class="d-flex justify-content-end input-group mt-2">
    <div id="peakStateToggle" class="btn-group btn-group-toggle" data-toggle="buttons">
        <div class="input-group-prepend" data-toggle="tooltip"
            title="Use peak state? If not then current/last state is used instead.">
            <span class="input-group-text">Peak State</span>
        </div>
        <label id="peakStateNoButton" class="btn active">
            <input type="radio" checked name="options"> No
        </label>
        <label id="peakStateYesButton" class="btn">
            <input type="radio" name="options"> Yes
        </label>
    </div>
    <button id="dumpSubmitButton" class="btn ml-3">Submit</button>
</div>
`),t.tooltip({title:"Allows for importing a build from a scoresheet or current run dump."}),t.popover({sanitize:!1}),t.on("shown.bs.popover",r=>{t.tooltip("hide");const s=o(`#${o(r.target).attr("aria-describedby")}`).children(".popover-body");s.find("#dumpText").on("click",l=>{l.stopPropagation()}),pe(s.find("#peakStateToggle")),s.find('[data-toggle="tooltip"]').tooltip(),s.find("#dumpSubmitButton").on("click",()=>{let l=s.find("#dumpText").val();const u=l,I=s.find("#peakStateYesButton").hasClass("active");function L(E){const k=E.exec(l);return k!==null&&(l=l.substring(k.index+k[0].length)),k}function A(){if(l[0]==">")return null;const E=L(/^ *([^\n>]*)\n/);return E===null?null:E[1]}function P(E){const k=I?`> *-* ${E} *-*
`:`> *-* ${E} \\(\\d*\\) *-*
`;if(L(new RegExp(k))===null)return null;const J=[];for(let ee=A();ee!=null;ee=A()){const te=Ke(ee);if(te===null)continue;const se=J.find(ge=>ge.name===te.name);se!==void 0?se.number+=1:J.push({name:te.name,active:!0,number:1})}return J}function N(){let E=L(/ Route \n-*\n/);if(E===null)return;let k=11;const G=/-(\d+)\/\w*.*\n/;for(E=L(G);E!==null;){const J=q(E[1],10);if(k=Math.min(J,k),J>k)break;E=L(G)}return-k}function _(){let E=0;const k=/increased core energy generation \(\+(\d+)\)/g;let G;for(;(G=k.exec(u))!==null;)E+=q(G[1],0);return E}function O(){let E=0;const k=/increased core heat dissipation \(\+(\d+)\)/g;let G;for(;(G=k.exec(u))!==null;)E+=q(G[1],0);return E}t.popover("hide");const z=[],w=P("POWER"),b=P("PROPULSION"),K=P("UTILITY"),re=P("WEAPON");if(w===null||b===null||K===null||re===null){me(t,"Failed to import","Import From Dump",3e3);return}z.push(w),z.push(b),z.push(K),z.push(re);const Z=N(),j=_(),U=O();M(z,Z,j,U),me(t,"Imported!","Import From Dump",3e3)})}),o(".popover").on("click",r=>{r.stopPropagation()})}function x(){X.forEach(t=>{ie(t,"")})}function D(){const t=window.location.hash.substring(1);if(B={b11:!1,parts:$},t.length===0)return;const r=He.decompressFromEncodedURIComponent(t);if(r===null)return;const s=JSON.parse(r);s===void 0||s.b11===void 0||s.parts===void 0||(B=s)}function S(t){X.forEach((r,s)=>{const n=o("#"+r.id);n.find(".input-group > button:last-child").trigger("click"),t[s].forEach((l,u)=>{var I;n.find("select:last").selectpicker("val",l.name),n.children(`div:eq(${u})`).find(".form-control:last").val(((I=l.number)==null?void 0:I.toString())??""),l.active==!1&&ot(n.find(`.btn-group-toggle:eq(${u})`),2)})})}function M(t,r,s,n){r!==void 0&&o("#depthInput").val(r),s!==void 0&&o("#energyGenInput").val(s),n!==void 0&&o("#heatDissipationInput").val(n),S(t)}function m(){Ge(),i(),Ve()}function i(){let t=0;X.map(r=>r.id).forEach(r=>{o("#"+r).children("div").each((s,n)=>{const l=o(n);l.find("select").selectpicker("val")in ne&&(d(l.children("div:last"),a.partsInfo[t]),t+=1)})}),X.forEach(r=>{const s=a.slotsPerType.get(r.slot);o("#"+r.labelId).text(`${r.slot} x${s}`)}),y()}function y(){const t=f(),r=o("#coreInfoContainer");switch(r.empty(),t){case"Coverage":T(r,100,1e4/a.totalCoverage,"Default");break;case"Energy/Move":{const s=a.coreInfo.energyPerMove,n=s*100/a.totalEnergyGenPerMove;T(r,s,n,"EnergyGen");break}case"Energy/Turn":{const s=a.coreInfo.energyPerTurn,n=s*100/a.totalEnergyGenPerTurn;T(r,s,n,"EnergyGen");break}case"Energy/Volley":{const s=a.coreInfo.energyPerVolley,n=s*100/a.totalEnergyGenPerVolley;T(r,s,n,"EnergyGen");break}case"Heat/Move":{const s=a.coreInfo.heatPerMove,n=-s*100/a.totalHeatDissipationPerMove;T(r,s,n,"HeatDissipation");break}case"Heat/Turn":{const s=a.coreInfo.heatPerTurn,n=-s*100/a.totalHeatDissipationPerTurn;T(r,s,n,"HeatDissipation");break}case"Heat/Volley":{const s=a.coreInfo.heatPerVolley,n=-s*100/a.totalHeatDissipationPerVolley;T(r,s,n,"HeatDissipation");break}case"Integrity":{const s=a.coreInfo.integrity,n=s*100/a.totalIntegrity;T(r,s,n,"Default");break}case"Mass":{const s=a.coreInfo.mass,n=-s*100/a.totalSupport;T(r,s,n,"MassSupport");break}case"Vulnerability":{const s=a.coreInfo.vulnerability,n=s-a.highestVulnerability,l=a.lowestVulnerability-a.highestVulnerability,u=l===0?100:100*(1-n/l);c(r,Math.ceil(s),u,"","Vulnerability");break}default:Ie(t)}}function d(t,r){t.empty();const s=f();switch(s){case"Coverage":{const n=r.coverage,l=n*100/a.totalCoverage;T(t,n,l,"Default");break}case"Energy/Move":{const n=r.energyPerMove;let l=0,u="Default";n>0?(l=n*100/a.totalEnergyGenPerMove,u="EnergyGen"):n<0&&(l=-n*100/a.totalEnergyUsePerMove,u="EnergyConsumption"),T(t,n,l,u);break}case"Energy/Turn":{const n=r.energyPerTurn;let l=0,u="Default";n>0?(l=n*100/a.totalEnergyGenPerTurn,u="EnergyGen"):n<0&&(l=-n*100/a.totalEnergyUsePerTurn,u="EnergyConsumption"),T(t,n,l,u);break}case"Energy/Volley":{const n=r.energyPerVolley;let l=0,u="Default";n>0?(l=n*100/a.totalEnergyGenPerVolley,u="EnergyGen"):n<0&&(l=-n*100/a.totalEnergyUsePerVolley,u="EnergyConsumption"),T(t,n,l,u);break}case"Heat/Move":{const n=r.heatPerMove;let l=0,u;n>0?(l=n*100/a.totalHeatGenPerMove,u="HeatGen"):(l=-n*100/a.totalHeatDissipationPerMove,u="HeatDissipation"),T(t,n,l,u);break}case"Heat/Turn":{const n=r.heatPerTurn;let l=0,u;n>0?(l=n*100/a.totalHeatGenPerTurn,u="HeatGen"):(l=-n*100/a.totalHeatDissipationPerTurn,u="HeatDissipation"),T(t,n,l,u);break}case"Heat/Volley":{const n=r.heatPerVolley;let l=0,u;n>0?(l=n*100/a.totalHeatGenPerVolley,u="HeatGen"):(l=-n*100/a.totalHeatDissipationPerVolley,u="HeatDissipation"),T(t,n,l,u);break}case"Integrity":{const n=r.integrity,l=n*100/a.totalIntegrity;T(t,n,l,"Default");break}case"Mass":{const n=r.mass;let l=0,u;n>0?(l=n*100/a.totalMass,u="Mass"):(l=-n*100/a.totalSupport,u="MassSupport"),T(t,n,l,u);break}case"Vulnerability":{const n=r.vulnerability,l=n-a.highestVulnerability,u=a.lowestVulnerability-a.highestVulnerability,I=u===0?100:100*(1-l/u);c(t,Math.ceil(n),I,"","Vulnerability");break}default:Ie(s)}}function Ge(){function t(e,h){return e+h}function r(e,h,C){if(!e.active)return 0;if(e.part.slot==="Propulsion"){const ae=s(e,h);return V(ae,C)-(e.part.energyPerMove??0)}else return V(s(e,h),C)}function s(e,h){return e.active&&e.part.slot==="Power"?(e.part.energyGeneration??0)*h:R(e.part,e.abilityActive,"FusionCompressor")?e.part.specialProperty.trait.energyPerTurn:e.active&&e.part.slot==="Propulsion"||e.part.slot==="Utility"?-(e.part.energyUpkeep??0):R(e.part,e.abilityActive,"WeaponRegen")?-e.part.specialProperty.trait.energyPerTurn:0}function n(e,h,C,ae){return e.active?e.part.slot==="Weapon"?-(e.part.shotEnergy??0)*h:V(s(e,C),ae):0}function l(e,h){return e.active&&e.part.slot==="Propulsion"?V(u(e),h)+(e.part.heatPerMove??0):V(u(e),h)}function u(e){return R(e.part,e.active,"HeatDissipation")?-e.part.specialProperty.trait.dissipation:e.active&&(e.part.slot==="Power"||e.part.slot==="Propulsion"||e.part.slot==="Utility")?e.part.heatGeneration??0:0}function I(e,h){return e.active?e.part.slot==="Weapon"?e.part.shotHeat??0:V(u(e),h):0}function L(e){return e.active&&e.part.slot==="Propulsion"?-e.part.support:R(e.part,e.active,"MassSupport")?-e.part.specialProperty.trait.support:e.part.mass??0}function A(e,h){return e.part.coverage===void 0?0:1/(e.part.coverage/h)*e.part.integrity}const P=[];X.map(e=>e.id).forEach(e=>{o("#"+e).find(".input-group").each((h,C)=>{const ae=o(C),Se=ae.find("label:first").hasClass("active"),qe=Math.max(1,q(ae.children("input").val(),1)),ke=ae.find("select").selectpicker("val");ke in ne&&P.push({abilityActive:Se,active:Se,number:qe,part:ne[ke]})})});const N=P.find(e=>e.active&&e.part.slot==="Propulsion");let _,O;const z=P.map(e=>(e.part.mass??0)*e.number).reduce(t,0);N!==void 0&&(_=N.part.type);const w=[];P.filter(e=>e.active&&e.part.type===_).forEach(e=>{for(let h=0;h<e.number;h++)w.push(e.part)}),w.sort((e,h)=>(e.modPerExtra??0)-(h.modPerExtra??0)),w.length===0?O=3:O=w.map(e=>e.support).reduce(t,0),O+=P.filter(e=>R(e.part,e.active,"MassSupport")).map(e=>e.part.specialProperty.trait.support).reduce(t,0),P.forEach(e=>{e.part.slot==="Propulsion"&&!w.includes(e.part)&&(e.active=!1)});let b,K;w.length===0?(b=50,K=50):(b=Math.trunc(w.map(e=>e.timePerMove).reduce(t,0)/w.length),K=Math.trunc(w.map(e=>e.penalty).reduce(t,0)/w.length),b+=w.filter((e,h)=>h!==0).map(e=>e.modPerExtra??0).reduce(t,0)),P.find(e=>R(e.part,e.active,"AirborneSpeedDoubling"))!==void 0&&(w.length===0||w[0].type===Q.HoverUnit||w[0].type===Q.FlightUnit)&&(b/=2),b+=Math.trunc(Math.max(0,z-1)/O)*K,(_===Q.FlightUnit||_===Q.HoverUnit)&&(b+=P.filter(e=>e.part.slot==="Propulsion").map(e=>e.part.drag??0).reduce(t,0)),(_===Q.FlightUnit||_===Q.HoverUnit)&&(b=Math.max(b,10)),P.find(e=>R(e.part,e.active,"Metafiber"))!==void 0&&w.length>0&&w[0].type===Q.Leg&&(b*=.8);const re=P.find(e=>e.active&&e.part.slot==="Weapon"),Z=re!==void 0&&ce(re.part),j=[];P.forEach(e=>{if(e.part.slot==="Weapon"){if(Z&&!ce(e.part)||!Z&&ce(e.part))e.active=!1;else if(e.active)for(let h=0;h<e.number&&(j.push(e.part),!Z);h++);}});let U;if(Z){const e=P.filter(C=>R(C.part,C.active,"Actuator"));let h=0;e.forEach(C=>h+=C.part.specialProperty.trait.amount*C.number),h=1-Math.min(.5,h),U=h*((j[0].delay??0)+st[1])}else{let e=0;P.filter(h=>R(h.part,h.active,"QuantumCapacitor")).length>0&&j.length===1&&(j[0].type===Q.EnergyGun||j[0].type===Q.EnergyCannon)||P.filter(h=>R(h.part,h.active,"LauncherLoader")).length>0&&j.length===1&&j[0].type===Q.Launcher?e=.5:(P.filter(C=>R(C.part,C.active,"RangedWeaponCycling")).forEach(C=>e+=C.part.specialProperty.trait.amount),e=1-Math.min(.3,e)),U=lt(j,e)}const E=p(),k=q(o("#energyGenInput").val(),0),G=q(o("#heatDissipationInput").val(),0),J=P.map(e=>(e.part.coverage??0)*e.number).reduce(t,0)+100,ee={coverage:100,energyPerMove:w.length>0?V(5,b):V(5,b)-1,energyPerTurn:5,energyPerVolley:w.length>0?V(5,U):V(5,U)-1,heatPerMove:-V(55-3*E+G,b),heatPerTurn:-(55-3*E+G),heatPerVolley:-V(55-3*E+G,U),integrity:1750-150*E,mass:w.length>0?0:-3,size:0,slot:"N/A",vulnerability:J/100*(1750-150*E)};let te=1;P.forEach(e=>{R(e.part,e.active,"PowerAmplifier")&&(te+=e.part.specialProperty.trait.percent*e.number)});const se=[];P.forEach(e=>{if(R(e.part,e.active,"EnergyFilter"))for(let h=0;h<e.number;h++)se.push(e.part.specialProperty.trait.percent)});const[ge,Ae]=v(se),be=1-(ge+.5*Ae),Me=P.map(e=>{let h=e.active?e.number:0;return Z&&ce(e.part)&&e.active&&(h=1),{coverage:(e.part.coverage??0)*e.number,energyPerMove:r(e,te,b)*h,energyPerTurn:s(e,te)*h,energyPerVolley:n(e,be,te,U)*h,heatPerMove:l(e,b)*h,heatPerTurn:u(e)*h,heatPerVolley:I(e,U)*h,integrity:e.part.integrity*e.number,mass:L(e)*e.number,slot:e.part.slot,size:e.part.size*e.number,vulnerability:A(e,J)}}),oe=Me.concat(ee),fe=k+oe.map(e=>e.energyPerTurn>0?e.energyPerTurn:0).reduce(t,0),de=oe.map(e=>e.energyPerTurn<0?-e.energyPerTurn:0).reduce(t,0),ye=oe.map(e=>e.heatPerTurn<0?-e.heatPerTurn:0).reduce(t,0),he=oe.map(e=>e.heatPerTurn>0?e.heatPerTurn:0).reduce(t,0),Ue=oe.map(e=>e.integrity).reduce(t,0);let le=w.map(e=>e.energyPerMove??0).reduce(t,0);le===0&&(le=1);const Te=w.map(e=>e.heatPerMove??0).reduce(t,0),Ce=V(fe,b),Be=V(de,b)+le,Le=V(ye,b),_e=V(he,b)+Te,we=j.map(e=>(e.shotEnergy??0)*be).reduce(t,0),Ee=j.map(e=>e.shotHeat??0).reduce(t,0),Fe=V(fe,U),Ne=V(de,U)+we,Oe=V(ye,U),je=V(he,U)+Ee,xe=oe.map(e=>e.vulnerability).filter(e=>e!==0),Re=Math.max(...xe,ee.vulnerability)/.9,We=Math.min(...xe,ee.vulnerability)*.9,ze=100+P.map(e=>R(e.part,e.active,"EnergyStorage")?e.part.specialProperty.trait.storage*e.number:e.active&&e.part.slot==="Power"?(e.part.energyStorage??0)*e.number:0).reduce(t,0),ve=new Map([["N/A",0],["Power",0],["Propulsion",0],["Utility",0],["Weapon",0]]);oe.forEach(e=>{ve.set(e.slot,ve.get(e.slot)+e.size)}),a={activePropulsionType:_,coreInfo:ee,isMelee:Z,partsInfo:Me,energyStorage:ze,energyUsePerMove:le,energyUsePerVolley:we,heatGenPerMove:Te,heatGenPerVolley:Ee,lowestVulnerability:Re,highestVulnerability:We,slotsPerType:ve,totalCoverage:J,totalEnergyGenPerMove:Ce,totalEnergyGenPerTurn:fe,totalEnergyGenPerVolley:Fe,totalEnergyUsePerMove:Be,totalEnergyUsePerTurn:de,totalEnergyUsePerVolley:Ne,totalHeatDissipationPerMove:Le,totalHeatDissipationPerTurn:ye,totalHeatDissipationPerVolley:Oe,totalHeatGenPerTurn:he,totalHeatGenPerMove:_e,totalHeatGenPerVolley:je,totalIntegrity:Ue,totalMass:z,totalSupport:O,tusPerMove:b,tusPerVolley:U}}function Ve(){const t=o("#summaryContainer");function r(n,l,u){typeof l=="number"&&!Number.isInteger(l)&&(l=l.toFixed(1));const I=o(`<div class="input-group-prepend mr-1 mt-1" data-toggle="tooltip"
                title="${u}">
                <span class="input-group-text">${n}: ${l}</span>
            </div>`);t.append(I[0]),I.tooltip()}t.children().tooltip("dispose"),t.empty();const s=a.totalSupport>=a.totalMass?"":" 0x"+Math.trunc(a.totalMass/a.totalSupport);r("Support",`${a.totalMass}/${a.totalSupport}${s}`,"Total mass / total support, including overweight multiplier if applicable."),r("Movement",`${Je(a.activePropulsionType)} (${a.tusPerMove})`,"Movement type and speed."),r("Total Integrity",a.totalIntegrity,"Total integrity of all parts and core."),r("Total Coverage",a.totalCoverage,"Total coverage of all parts and core."),r("Energy Storage",a.energyStorage,"Total energy storage of all equipped parts"),r("Net Energy/Turn",a.totalEnergyGenPerTurn-a.totalEnergyUsePerTurn,"The amount of energy gained (or lost) per turn by waiting."),r("Net Heat/Turn",a.totalHeatGenPerTurn-a.totalHeatDissipationPerTurn,"The amount of heat gained (or lost) per turn by waiting."),r("Net Energy/Move",a.totalEnergyGenPerMove-a.totalEnergyUsePerMove,"The amount of energy gained (or lost) per single tile move."),r("Net Heat/Move",a.totalHeatGenPerMove-a.totalHeatDissipationPerMove,"The amount of heat gained (or lost) per single tile move."),r("Volley Time",a.tusPerVolley,"The amount of TUs per volley. For melee this assumes no followups."),r("Net Energy/Volley",a.totalEnergyGenPerVolley-a.totalEnergyUsePerVolley,"The amount of energy gained (or lost) per full volley. For melee this assumes no followups."),r("Net Heat/Volley",a.totalHeatGenPerVolley-a.totalHeatDissipationPerVolley,"The amount of heat gained (or lost) per full volley. For melee this assumes no followups.")}});
