import{h as D,M as m,I as F,D as h,C as v,N as k,S as oe,F as te}from"./common-tz8-agHB.js";const se=10,le=95,ae=100,de=1e5,w=["Phase Wall","Vortex Field Projector","7V-RTL'S Ultimate Field","Force Field","Imp. Force Field","Adv. Force Field","Exp. Force Field","Shield Generator","Imp. Shield Generator","Adv. Shield Generator","Exp. Shield Generator","Stasis Bubble","Stasis Trap","Remote Shield","Imp. Remote Shield","Remote Force Field","Imp. Remote Force Field","Energy Mantle","Imp. Energy Mantle","AEGIS Remote Shield"],S={"Remote Shield":.75,"Stasis Trap":.75,"Phase Wall":.5,"Remote Force Field":.5,"Stasis Bubble":.5},b=[4,6,8],ee=[5,6,8,12],ce={"Wide (10)":10,"Intermediate (30)":30,"Narrow (50)":50,"Fine (100)":100},ie={1:200,2:300,3:325,4:350,5:375,6:400};function X(e,i,r,n,c,I,u,t,l,s,y,g){const R=[],P=Math.trunc(r/n);if(I)for(let o=0;o<n;o++)R.push({armorAnalyzed:!1,critical:void 0,coreBonus:0,damageType:y,disruptChance:0,forceCore:!1,originalDamage:P,realDamage:0,salvage:g,spectrum:0});else for(let o=0;o<n;o++)R.push({armorAnalyzed:u,coreBonus:e.offensiveState.coreAnalyzerChance,critical:c,damageType:y,disruptChance:t,forceCore:!1,originalDamage:P,realDamage:0,salvage:g,spectrum:l});const j=B(i.defensiveState.damageReduction),Z=j!=null?j.reduction:1;j!==void 0&&j.remote?R.forEach(o=>{o.realDamage=o.originalDamage-Math.trunc(o.originalDamage*(1-Z))}):R.forEach(o=>{o.realDamage=Math.trunc(o.originalDamage*Z)});function _(o){if(o.def.slot!=="Power")return;const d=o.def;if(d.explosionDamageMax>0&&d.explosionType!==void 0){const a=m(d.explosionDamageMin,d.explosionDamageMax),M=m(d.minChunks??0,d.maxChunks??0),E=Math.trunc(a/M);i.salvage+=d.explosionSalvage;for(let x=0;x<M;x++)Q(0,E,d.explosionType,void 0,!1,!1,d.explosionDisruption,pe(d.explosionSpectrum),!1)}}function Q(o,d,a,M,E,x,C,W,V){const{part:A,partIndex:L}=ge(i,o,a,E,x,V);N(d,a,M,C,W,E,A,L)}function z(o,d,a,M,E){if(i.parts.splice(o,1),i.armorAnalyzedCoverage-=d.armorAnalyzedCoverage,i.armorAnalyzedSiegedCoverage-=d.armorAnalyzedSiegedCoverage,i.siegedCoverage-=d.siegedCoverage,i.totalCoverage-=d.coverage,d.resistances!==void 0&&Object.keys(d.resistances).forEach(x=>{x in i.resistances&&(i.resistances[x]-=d.resistances[x])}),a>0&&!d.protection&&s&&c===void 0&&Q(0,a,M,void 0,!0,!1,0,0,!1),M===h.Impact){let x=m(50,150);x=J(i,x,h.Electromagnetic),$(x)}E==="CriticalRemove"&&d.integrity>0&&d.def.type!==F.Processor&&d.def.type!==F.Hackware&&(e.lootState.items[d.initialIndex].numDrops+=1,e.lootState.items[d.initialIndex].totalCritRemoves+=1,e.lootState.items[d.initialIndex].totalIntegrity+=d.integrity),d.integrity=0,G(e)}function $(o){let d=B(i.defensiveState.corruptionPrevent);for(;o>0&&d!==void 0;){const a=Math.ceil(d.part.integrity/2);if(a<o)d.part.integrity-=o*=2,o=0;else{i.defensiveState.corruptionPrevent.shift();const M=i.parts.indexOf(d.part);z(M,d.part,0,h.Entropic,"Integrity"),d=B(i.defensiveState.corruptionPrevent),o-=a}}i.corruption+=o}function N(o,d,a,M,E,x,C,W){function V(f){return f===v.Destroy||f===v.Smash}if(a!==void 0&&(i.immunities.includes(k.Criticals)||B(i.defensiveState.critImmunity)!==void 0)&&(a=void 0),a===v.Meltdown&&!i.immunities.includes(k.Meltdown)){i.coreIntegrity=0;return}else if(a===v.Intensify)o*=2;else if(a===v.Impale)o*=2,e.tus+=100;else if(a===v.Detonate){let f;for(f=0;f<i.parts.length&&i.parts[f].def.slot!=="Power";f++);if(f<i.parts.length){const p=i.parts[f];if(z(f,p,0,h.Entropic,"Integrity"),_(p),f===W)return}}else((a===v.Sever||a===v.Sunder)&&i.immunities.includes(k.Dismemberment)||a===v.Phase&&(i.immunities.includes(k.Coring)||K(i,"Core")===void 0))&&(a=void 0);if(C===void 0){const f=x?void 0:K(i,"Core");if((a===v.Destroy||a==v.Phase||a==v.Smash||a==v.Sunder||a==v.Sever)&&(i.immunities.includes(k.Coring)||f!==void 0)&&(a=void 0),f!=null){const p=Math.trunc(f.reduction*o);if(f.part.integrity-=p,f.part.integrity<=0){const T=i.parts.indexOf(f.part);z(T,f.part,0,h.Entropic,"Integrity")}o=o-p}if(a===v.Destroy||a===v.Smash?i.coreIntegrity=0:i.coreIntegrity-=o,i.coreIntegrity===0)return;if(!i.immunities.includes(k.Disruption)&&m(0,99)<M/2&&(i.coreDisrupted=!0),a===v.Sever||a===v.Sunder){const p=a===v.Sunder?m(1,2):1;for(let T=0;T<p;T++){const{part:H,partIndex:re}=q(i,void 0);H===void 0||K(i,H.def.slot)!==void 0||H.def.size>1||(H.integrity-=Math.trunc(H.def.integrity*m(5,25)/100),z(re,H,0,h.Phasic,"CriticalRemove"))}return}else if(a===v.Blast){const{part:p,partIndex:T}=q(i,void 0);if(p===void 0||K(i,p.def.slot)!==void 0)return;p.def.size===1?(N(o,h.Phasic,void 0,0,0,!1,p,T),p.integrity>0&&!i.immunities.includes(k.Dismemberment)&&z(T,p,0,h.Phasic,"CriticalRemove")):N(o,h.Phasic,void 0,0,0,!1,p,T)}else if(a===v.Phase){const{part:p,partIndex:T}=q(i,void 0);N(o,h.Phasic,void 0,0,0,!1,p,T)}return}const A=C.def.type===F.Protection||x?void 0:K(i,C.def.slot);A!==void 0&&V(a)&&(a=void 0);const L=C.def.slot==="Power"&&m(0,99)<E;if((V(a)&&C.protection||i.sieged&&C.def.type===F.Treads&&C.def.siege!==void 0)&&(a=void 0,o=Math.trunc(1.2*o)),C.selfDamageReduction!==0?o=Math.trunc(o*C.selfDamageReduction):C.def.type===F.Treads&&C.def.siege!==void 0&&i.sieged&&(o=Math.trunc(o*(C.def.siege===oe.High?.5:.75))),A!=null){const f=Math.trunc(A.reduction*o);if(A.part.integrity-=f,A.part.integrity<=0){const p=i.parts.indexOf(A.part);z(p,A.part,0,h.Entropic,"Integrity")}o=o-f}const U=C.integrity<=o||V(a)||L;if(!U&&(a===v.Sever||a===v.Sunder)&&C.def.size===1&&A===void 0&&(U||z(W,C,0,h.Slashing,"CriticalRemove")),U){const f=a===v.Smash?o:o-C.integrity;z(W,C,f,d,"Integrity")}else C.integrity-=o;const ne=W;if(a===v.Blast){const{part:f,partIndex:p}=q(i,U?ne:void 0);if(f===void 0||A!==void 0)return;f.def.size===1?(N(o,h.Phasic,void 0,0,0,!1,f,p),f.integrity>0&&!i.immunities.includes(k.Dismemberment)&&z(p,f,0,h.Phasic,"CriticalRemove")):N(o,h.Phasic,void 0,0,0,!1,f,p)}else a===v.Phase&&N(o,h.Phasic,void 0,0,0,!1,void 0,-1);L&&_(C)}i.salvage+=g,R.forEach(o=>{if(o.realDamage!==0&&(Q(o.coreBonus,o.realDamage,o.damageType,o.critical,!1,o.forceCore,o.disruptChance,o.spectrum,o.armorAnalyzed),y===h.Electromagnetic)){const d=B(i.defensiveState.corruptionIgnore),a=c===v.Corrupt&&!i.immunities.includes(k.Criticals);if(d===void 0||m(0,99)>=d.chance){const M=a?1.5:m(50,150)/100,E=o.originalDamage*M;$(E)}}})}function fe(e){const i={};Object.keys(e.resistances).forEach(n=>i[n]=e.resistances[n]);const r={armorAnalyzedCoverage:e.armorAnalyzedCoverage,armorAnalyzedSiegedCoverage:e.armorAnalyzedSiegedCoverage,behavior:e.behavior,coreCoverage:e.coreCoverage,coreDisrupted:e.coreDisrupted,coreIntegrity:e.coreIntegrity,corruption:e.corruption,def:e.def,defensiveState:void 0,externalDamageReduction:e.externalDamageReduction,immunities:e.immunities,initialCoreIntegrity:e.initialCoreIntegrity,parts:e.parts.map(n=>({armorAnalyzedSiegedCoverage:n.armorAnalyzedSiegedCoverage,armorAnalyzedCoverage:n.armorAnalyzedCoverage,coverage:n.coverage,def:n.def,integrity:n.integrity,initialIndex:n.initialIndex,protection:n.protection,selfDamageReduction:n.selfDamageReduction,siegedCoverage:n.siegedCoverage})),regen:e.regen,resistances:i,running:e.running,runningEvasion:e.runningEvasion,runningMomentum:e.runningMomentum,salvage:0,sieged:e.sieged,siegedCoverage:e.siegedCoverage,tusToSiege:e.tusToSiege,totalCoverage:e.totalCoverage};return r.defensiveState=ue(r.parts,r.externalDamageReduction),r}function J(e,i,r){return r in e.resistances?Math.trunc(i*(1-e.resistances[r]/100)):i}function ue(e,i){const r={antimissile:[],avoid:[],corruptionIgnore:[],corruptionPrevent:[],corruptionReduce:[],critImmunity:[],damageReduction:[],rangedAvoid:[],shieldings:{Core:[],"N/A":[],Power:[],Propulsion:[],Utility:[],Weapon:[]}};if(e.forEach(n=>{if(D(n.def,!0,"AntimissileChance"))r.antimissile.push({chance:n.def.specialProperty.trait.chance,part:n});else if(D(n.def,!0,"ReactionControlSystem"))r.avoid.push({legs:n.def.specialProperty.trait.legsChance,other:n.def.specialProperty.trait.chance,part:n});else if(D(n.def,!0,"CorruptionIgnore"))r.corruptionIgnore.push({chance:n.def.specialProperty.trait.chance,part:n});else if(D(n.def,!0,"CorruptionPrevent"))r.corruptionPrevent.push({part:n});else if(D(n.def,!0,"CorruptionReduce"))r.corruptionReduce.push({amount:n.def.specialProperty.trait.amount,part:n});else if(D(n.def,!0,"CriticalImmunity"))r.critImmunity.push({part:n});else if(D(n.def,!0,"DamageReduction"))r.damageReduction.push({reduction:n.def.specialProperty.trait.multiplier,remote:n.def.specialProperty.trait.remote,part:n});else if(D(n.def,!0,"DamageResists"))n.resistances=n.def.specialProperty.trait.resists;else if(D(n.def,!0,"RangedAvoid"))r.rangedAvoid.push({avoid:n.def.specialProperty.trait.avoid,part:n});else if(D(n.def,!0,"SelfReduction"))n.selfDamageReduction=n.def.specialProperty.trait.shielding;else if(D(n.def,!0,"Shielding")){const c=n.def.specialProperty.trait;r.shieldings[c.slot].push({reduction:c.shielding,part:n})}}),i in S){const n=S[i],c=i.includes("Remote");if(r.damageReduction.length===0)r.damageReduction.push({reduction:n,remote:c,part:{armorAnalyzedSiegedCoverage:0,armorAnalyzedCoverage:0,coverage:0,def:void 0,integrity:1,initialIndex:0,protection:!1,selfDamageReduction:0,siegedCoverage:0}});else{const I=w.indexOf(r.damageReduction[0].part.def.name);w.indexOf(i)<I?r.damageReduction.unshift({reduction:n,remote:c,part:{armorAnalyzedCoverage:0,armorAnalyzedSiegedCoverage:0,coverage:0,def:void 0,integrity:1,initialIndex:0,protection:!1,selfDamageReduction:0,siegedCoverage:0}}):r.damageReduction.push({remote:c,reduction:n,part:{armorAnalyzedCoverage:0,armorAnalyzedSiegedCoverage:0,coverage:0,def:void 0,initialIndex:0,integrity:1,protection:!1,selfDamageReduction:0,siegedCoverage:0}})}}return r}function B(e){let i;for(;e.length>0;)if(e[0].part.integrity>0){i=e[0];break}else e.shift();return i}function ge(e,i,r,n,c,I){let u,t=-1;if(c)return{part:u,partIndex:t};if(r===h.Impact){let l=m(0,e.parts.map(s=>s.def.size).reduce(te,0));for(let s=0;s<e.parts.length;s++){if(l<e.parts[s].def.size){t=s;break}l-=e.parts[s].def.size}t>=0&&(u=e.parts[t])}else if(n){const l=e.parts.filter(s=>s.protection&&s.coverage>0);if(l.length>0){let s=m(0,l.reduce((y,g)=>y+g.coverage,0));for(let y=0;y<l.length;y++)if(s-=l[y].coverage,s<0){u=l[y];break}t=e.parts.indexOf(u)}}if(u===void 0&&r!==h.Impact){let l;if(I?e.sieged?l=e.armorAnalyzedSiegedCoverage:l=e.armorAnalyzedCoverage:e.sieged?l=e.siegedCoverage:l=e.totalCoverage,r==h.Piercing&&(i+=8),i>0){l-=e.coreCoverage;const y=Math.min(e.coreCoverage/e.totalCoverage+i/100,.999),g=e.totalCoverage*y;l+=g}let s=m(0,l-1);for(t=0;t<e.parts.length;t++)if(I?e.sieged?s-=e.parts[t].armorAnalyzedSiegedCoverage:s-=e.parts[t].armorAnalyzedCoverage:e.sieged?s-=e.parts[t].siegedCoverage:s-=e.parts[t].coverage,s<0){u=e.parts[t];break}}return{part:u,partIndex:t}}function q(e,i){let r=m(0,e.parts.length-1-(i===void 0?0:1));return i!==void 0&&i>0&&r>=i&&(r+=1),r>=e.parts.length?{part:void 0,partIndex:-1}:{part:e.parts[r],partIndex:r}}function me(e,i,r){let n=0;return e.recoil!==void 0&&(n+=e.recoil,n-=i,n-=r),Math.max(n,0)}const ve=/Core Regeneration \((\d*)\)/;function Ce(e){const i=e.traits;for(let r=0;r<i.length;r++){const n=ve.exec(i[r]);if(n!=null)return parseInt(n[1])}return 0}function Ie(e,i){let r;return e.length in ie?r=ie[e.length]:r=400,e.forEach(n=>{r+=n.delay??0}),r*=i,Math.trunc(Math.max(25,r))}function K(e,i){return B(e.defensiveState.shieldings[i])}function O(e){let i=e.corruption;return e.defensiveState.corruptionReduce.forEach(r=>{r.part.integrity>=0&&(i-=r.amount)}),i}const ye={Kill:{volleyEndCondition:function(e){return e.coreIntegrity<=0||O(e)>=100},projectileEndCondition:function(e){return e.coreIntegrity<=0}},"Kill or Core Disrupt":{projectileEndCondition:function(e){return e.coreIntegrity<=0},volleyEndCondition:function(e){return e.coreIntegrity<=0||O(e)>=100||e.coreDisrupted}},"Kill or No Power":{projectileEndCondition:function(e){return e.coreIntegrity<=0},volleyEndCondition:function(e){return e.coreIntegrity<=0||O(e)>=100||e.parts.every(i=>i.def.slot!="Power")}},"Kill or No Weapons":{projectileEndCondition:function(e){return e.coreIntegrity<=0},volleyEndCondition:function(e){return e.coreIntegrity<=0||O(e)>=100||e.parts.every(i=>i.def.slot!="Weapon")}},"Kill or No TNC":{projectileEndCondition:function(e){return e.coreIntegrity<=0},volleyEndCondition:function(e){return e.coreIntegrity<=0||O(e)>=100||e.parts.every(i=>i.def.name!="Transport Network Coupler")}},"Architect Tele (80% integrity, 1 weapon, or 1 prop)":{projectileEndCondition:function(e){return e.coreIntegrity<=0},volleyEndCondition:function(e){return e.coreIntegrity<=e.initialCoreIntegrity*.8||e.parts.filter(i=>i.def.slot==="Weapon").length===1||e.parts.filter(i=>i.def.slot==="Propulsion").length===1}}};function xe(e){const i=fe(e.initialBotState);e.botState=i;const r=e.offensiveState;let n=0,c=0;e.tus=0,e.actionNum=0,G(e);const I=ye[e.endCondition];r.sneakAttack=r.sneakAttackStrategy==="All"||r.sneakAttackStrategy==="First Only",r.momentum.current=r.momentum.bonus+r.momentum.initial;let u=!1;for(;!u;){const l=Math.trunc(c/100),s=Math.trunc(e.tus/100),y=i.regen*(s-l);i.coreIntegrity=Math.min(i.initialCoreIntegrity,i.coreIntegrity+y),n+=1;let g=r.volleyTime;if(r.melee){u=Y(e,e.weapons[0],I.projectileEndCondition),e.actionNum+=1,e.actionNum<=2&&G(e);for(let P=1;P<e.weapons.length&&!u;P++)m(0,99)<r.followupChances[P-1]&&(u=Y(e,e.weapons[P],I.projectileEndCondition),g+=.5*e.weapons[P].delay);g*=r.volleyTimeModifier,n===1&&(r.sneakAttackStrategy==="First Only"&&(r.sneakAttack=!1),r.momentum.current=r.momentum.bonus)}else{let P=!0;for(const j of e.weapons){if(u=Y(e,j,I.projectileEndCondition),u)break;P&&(P=!1,e.actionNum+=1,e.actionNum<=2&&G(e))}}if(n>=de)return!1;r.ramming&&(g=Math.max(100,r.speed)),c=e.tus,e.tus+=g;let R=!1;!r.melee&&c<r.siegeBonus.tus&&e.tus>=r.siegeBonus.tus&&(R=!0),c<i.tusToSiege&&e.tus>=i.tusToSiege&&i.behavior==="Siege/Fight"&&i.parts.find(P=>P.def.type===F.Treads&&P.def.siege!==void 0)!==void 0&&(i.sieged=!0,R=!0),i.behavior==="Run When Hit"&&i.runningMomentum<3&&(i.running=!0,i.runningMomentum=Math.min(Math.trunc(e.tus/i.def.speed),3)),R&&G(e),u=I.volleyEndCondition(i)}n in e.killVolleys?e.killVolleys[n]+=1:e.killVolleys[n]=1,e.tus in e.killTus?e.killTus[e.tus]+=1:e.killTus[e.tus]=1;for(const l of i.parts)if(l.integrity>0){const s=e.lootState.items[l.initialIndex];let y=m(0,99)<l.integrity/l.def.integrity*100/2+i.salvage;const g=O(i);y&&g>0&&m(0,99)<g-l.def.integrity&&(s.totalFried+=1,y=!1),y&&(s.totalIntegrity+=l.integrity,s.numDrops+=1,m(0,99)<g&&(s.totalCorruptionPercent+=m(1,Math.min(10*g/100,15))))}e.lootState.numKills+=1;let t=m(i.def.salvageLow,i.def.salvageHigh);return t+=i.salvage,t=Math.max(0,t),t=Math.min(t,i.def.salvageHigh),e.lootState.matterDrop+=t,!0}function Y(e,i,r){const n=e.botState,c=e.offensiveState;if(c.ramming){const I=100/e.offensiveState.speed*100;let u=((10+i.def.mass)/5+1)*(I/100)*Math.max(e.offensiveState.momentum.current,1);u=Math.min(100,u);let t=m(0,u);return t=J(n,t,h.Impact),t>0&&X(e,n,t,1,void 0,!1,!1,!1,!1,!0,h.Impact,3),r(n)}for(let I=0;I<i.numProjectiles;I++){let u=c.melee&&c.sneakAttack||m(0,99)<i.accuracy;if(u&&i.isMissile){const t=B(n.defensiveState.antimissile);if(t!=null){const l=t.chance,s=Math.min(4,c.distance);for(let y=0;y<s;y++)if(m(0,99)<l){u=!1;break}}}if(u){if(i.def.type===F.BallisticCannon&&(i.def.salvage??0)<-2&&(e.lootState.matterBlasted+=Math.trunc(m(0,-i.def.salvage))),i.damageType!=null){let t=m(i.damageMin,i.damageMax);if(i.overloaded&&(t=Math.trunc(t*2)),c.melee&&c.momentum.current>0){const y=100/c.speed*100;let g=c.momentum.current*y/1200*40;g=Math.trunc(g),g=Math.max(1,g),g=Math.min(40,g),i.damageType===h.Piercing&&(g*=2),g=g/100+1,t=Math.trunc(g*t)}c.melee&&c.sneakAttack&&(t*=2),c.analysis&&(t=Math.trunc(1.1*t)),i.accelerated&&(t=Math.trunc(c.chargerBonus*t)),t=J(n,t,i.damageType);const l=m(0,99)<c.armorAnalyzerChance,s=m(0,99)<i.criticalChance;if(t>0&&(X(e,n,t,1,s?i.criticalType:void 0,!1,l,i.disruption,i.spectrum,i.overflow,i.damageType,i.salvage),r(n)))return!0}if(i.explosionType!=null){let t=m(i.explosionMin,i.explosionMax);t=J(n,t,i.explosionType);const l=m(i.explosionChunksMin,i.explosionChunksMax);if(t>0&&(X(e,n,t,l,void 0,!0,!1,i.explosionDisruption,0,i.overflow,i.explosionType,i.salvage),r(n)))return!0}}}return!1}function pe(e){return e===void 0?0:ce[e]}function G(e){const i=e.offensiveState,r=e.botState;let n=0;const I=r.def.movement;(I.includes("Hovering")||I.includes("Flying"))&&(n-=10);const u=B(r.defensiveState.avoid);u!=null&&(I.includes("Walking")?n-=u.legs:n-=u.other),i.analysis&&(n+=5);let t=0;if(i.melee){for(let s=0;s<ee.length;s++)n+=i.meleeAnalysis[s]*ee[s];let l=0;for(let s=i.forceBoosters.length-1;s>=0;s--)i.forceBoosters[s]==2?(n-=1.5*b[s],l+=2):i.forceBoosters[s]==1&&(n-=b[s]*l==0?1:.5,l+=1)}else{n+=i.distance<6?(6-i.distance)*3:0;const l=i.siegeBonus;e.tus>=l.tus&&(t=l.bonus),n+=t;const s=B(r.defensiveState.rangedAvoid);s!=null&&(n-=s.avoid)}e.actionNum===0?n+=e.offensiveState.action1Accuracy:e.actionNum===1?n+=e.offensiveState.action2Accuracy:n+=10,r.sieged&&(n+=20),r.running&&(r.parts.find(l=>l.def.type===F.Leg)!==void 0&&(n-=5*r.runningMomentum),n-=r.runningEvasion),e.weapons.forEach(l=>{if(l.def.waypoints!==void 0){l.accuracy=100;return}let s=l.baseAccuracy+n;!i.melee&&t===0&&(s-=i.recoil-me(l.def,i.numTreads,i.recoilReduction));const y=i.melee?ae:le;l.accuracy=Math.min(y,Math.max(s,se))})}export{ue as a,Ce as b,me as c,xe as d,Ie as g,de as m,pe as s,ie as v};
