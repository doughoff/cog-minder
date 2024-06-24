import{t as eo,j as n,u as oo,r as S,c as Me,S as Ae,b as p,z as G,d as _,B as Z,a as ao,f as m,D as no,e as to,p as so,g as io}from"./index-z720myCg.js";import{L as ze,a as lo,s as ro,b as co,m as ke,c as Be,d as De,v as uo,g as mo,e as ho,f as po,i as fo,h as vo,j as Re}from"./simulatorCalcs-GNmgTtm6.js";import{u as Le,I as bo,C as go}from"./ItemPopover-86-E9ep5.js";import{S as yo,e as xo,C as Co,n as To,p as wo,o as No,L as jo,q as Mo,c as Ao,b as ko,f as Q,g as Bo,h as Do,i as Ro}from"./chartColors-KgjNrofN.js";import{u as Ve}from"./BotDetails-b_ns_Ijp.js";import{B as Fo}from"./BotPopover-5ZHAupLn.js";/* empty css              */import"./botTypes-Cxei0LoN.js";import"./items-wP--UJwD.js";import"./bots-KCDbiFQQ.js";import"./lore-yoaB2RHm.js";Co.register(To,wo,No,jo,Mo,Ao,ko);function Fe({chartTitle:o,values:t,backgroundColors:e,borderColors:r,isPercentage:c,stepSize:y,xLabel:f,yLabel:k}){const x=eo(),i=Math.max(...t.map(d=>Math.max(...d.values.map(R=>R.x))));return n.jsx(yo,{data:Eo(t,e,r),datasetIdKey:"id",options:zo(o,c,y,x,f,k,i),plugins:[xo]})}function Eo(o,t,e){return{datasets:o.map((r,c)=>({backgroundColor:t[c],borderColor:e[c],data:r.values,fill:"start",id:r.id||r.label,label:r.label,pointRadius:0,pointHitRadius:25,showLine:!0,stepped:"before"}))}}function zo(o,t,e,r,c,y,f){return{animation:{duration:300},color:Q,maintainAspectRatio:!1,plugins:{chartCanvasBackgroundColor:{color:r==="Cogmind"?Bo:Do},legend:{labels:{font:{size:16}}},title:{color:Q,font:{size:24},display:!0,text:o}},scales:{x:{border:{display:!1},min:0,max:f,grid:{display:!1},ticks:{color:Q,stepSize:e},title:{color:Q,display:c!==void 0,font:{size:24},text:c}},y:{border:{display:!1},max:t?100:void 0,min:t?0:void 0,grid:{color:Ro},ticks:{callback:t?(k,x,i)=>k+"%":void 0,color:Q},title:{color:Q,display:y!==void 0,font:{size:24},text:y}}}}}const me=[{value:"Stand/Fight"},{value:"Siege/Fight"},{value:"Already Sieged/Fight"},{value:"Running"},{value:"Run When Hit"}],Lo=[{value:"Ranged"},{value:"Melee"}],he=[{value:"None",label:"No damage reduction"},{value:"Remote Shield",label:"Remote Shield (25%)"},{value:"Stasis Trap",label:"Stasis Trap (25%)"},{value:"Phase Wall",label:"Phase Wall (50%)"},{value:"Remote Force Field",label:"Remote Force Field (50%)"},{value:"Stasis Bubble",label:"Stasis Bubble (50%)"}],be=[{value:"Kill"},{value:"Kill or Core Disrupt"},{value:"Kill or No Power"},{value:"Kill or No Weapons"}],We=[...be];We.push({value:"Tele",label:"Architect Tele (80% integrity, 1 weapon, or 1 prop)"});const Ie=[...be];Ie.push({value:"Kill or No TNC"});const pe=[{value:"No Siege"},{value:"In Siege Mode"},{value:"In High Siege Mode"},{value:"Entering Siege Mode"},{value:"Entering High Siege Mode"}],fe=[{value:"None"},{value:"First Only"},{value:"All"}],Vo=[{value:"Volleys"},{value:"Time"}],ee=[{value:"No"},{value:"Yes"}],Wo=["Impact Weapon","Piercing Weapon","Slashing Weapon","Special Melee Weapon"],Io=["Ballistic Cannon","Ballistic Gun","Energy Cannon","Energy Gun","Launcher","Special Weapon"],Ko=["Core Cannon","Core Stripper","Modified Sigix Sheargun","Sigix Broadsword","Sigix Shearcannon","Sigix Sheargun"];function Oo({disabled:o,i:t,pageState:e,updatePageState:r,weaponInfo:c,weaponItem:y,weaponOptions:f}){let k;const x=e.weaponState[t];return y.overloadStability?k=n.jsx(_,{label:"Overload",disabled:o,buttons:ee,tooltip:"Whether to fire the weapon as overloaded (double damage). Does not take into account effects of additional heat generation or stability-related effects.",selected:x.overload||"No",onValueChanged:i=>{const d=[...e.weaponState];d[t]={...x,overload:i},r({...e,weaponState:d})}}):Ko.includes(y.name)&&(k=n.jsx(_,{label:"Exoskeleton",disabled:o,buttons:ee,tooltip:"Whether a Sigix Exoskeleton is equipped (double damage on non-AOE Sigix weaponry).",selected:x.exo||"No",onValueChanged:i=>{const d=[...e.weaponState];d[t]={...x,exo:i},r({...e,weaponState:d})}})),n.jsxs("div",{className:"weapon-row",children:[n.jsxs("div",{className:"flex",children:[n.jsx(G,{id:c.id.toString(),isDisabled:o,className:"weapon-select",label:"Weapon",tooltip:"Name of an equipped weapon to fire.",options:f,value:f.find(i=>i.value===c.name),onChange:i=>{const d=[...e.weaponState];d[t]={id:x.id,name:i.value,number:x.number},r({...e,weaponState:d})}}),n.jsx(bo,{item:y,tooltip:"Show details about the part.",text:"?"})]}),n.jsx(p,{label:"Number",disabled:o,className:"flex-1-1",value:c.number||"",onChange:i=>{const d=[...e.weaponState];d[t]={...x,number:i},r({...e,weaponState:d})},placeholder:"1",tooltip:"How many weapons of this type to have equipped."}),k,n.jsx(Z,{tooltip:"Deletes this weapon.",disabled:o,onClick:()=>{const i=[...e.weaponState];i.splice(i.indexOf(c),1),r({...e,weaponState:i})},children:"X"})]})}function qo({pageState:o,simulationInProgress:t,updatePageState:e}){var V;const r=Ve(),c=Le(),y=oo(),f=S.useMemo(()=>r.getAllBotsSorted().filter(a=>Me(a.spoiler,y)).map(a=>({value:a.name})),[y]),k=S.useMemo(()=>c.getAllItemsSorted().filter(a=>{if(!Me(a.spoiler,y))return!1;if(o.combatType==="Melee"){if(!Wo.includes(a.type))return!1}else if(!Io.includes(a.type))return!1;if(a.damageType!=="Special")return!0}).map(a=>({value:a.name})),[y,o]),x=r.getBotOrNull(o.botName||"")===null?"G-34 Mercenary":o.botName,i=r.getBot(x);let d;i.name==="Architect"?d=We:i.name==="A-15 Conveyor"?d=Ie:d=be;const R=n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:"page-input-group",children:[n.jsx(Ae,{label:"Melee Analysis Suites",tooltip:"The number of each type of Melee Analysis Suites equipped. Provides bonus accuracy and a minimum damage increase, but not more than the maximum damage for a weapon."}),n.jsx(p,{label:"Standard",disabled:t,value:o.baseMas||"",onChange:a=>e({...o,baseMas:a}),placeholder:"0",tooltip:"The amount of standard Melee Analysis Suites equipped. Each provides 5% accuracy and a minimum damage increase of 2."}),n.jsx(p,{label:"Imp.",disabled:t,value:o.impMas||"",onChange:a=>e({...o,impMas:a}),placeholder:"0",tooltip:"The amount of Improved Melee Analysis Suites equipped. Each provides 6% accuracy and a minimum damage increase of 3."}),n.jsx(p,{label:"Adv.",disabled:t,value:o.advMas||"",onChange:a=>e({...o,advMas:a}),placeholder:"0",tooltip:"The amount of Advanced Melee Analysis Suites equipped. Each provides 8% accuracy and a minimum damage increase of 4."}),n.jsx(p,{label:"Adv.",disabled:t,value:o.expMas||"",onChange:a=>e({...o,expMas:a}),placeholder:"0",tooltip:"The amount of Experimental Melee Analysis Suites equipped. Each provides 12% accuracy and a minimum damage increase of 6."})]}),n.jsxs("div",{className:"page-input-group",children:[n.jsx(Ae,{label:"Force Boosters",tooltip:"The number of each type of Force Booster equipped. Provides a bonus to maximum damage and a decrease to accuracy. These utilities half_stack, so only the 2 highest ratings count."}),n.jsx(p,{label:"Standard",disabled:t,value:o.baseForceBoosters||"",onChange:a=>e({...o,baseForceBoosters:a}),placeholder:"0",tooltip:"The amount of standard Force Boosters equipped. Provides a maximum damage increase of 20% and a melee accuracy penalty of 4%."}),n.jsx(p,{label:"Imp.",disabled:t,value:o.impForceBoosters||"",onChange:a=>e({...o,impForceBoosters:a}),placeholder:"0",tooltip:"The amount of Improved Force Boosters equipped. Provides a maximum damage increase of 30% and a melee accuracy penalty of 6%."}),n.jsx(p,{label:"Adv.",disabled:t,value:o.advForceBoosters||"",onChange:a=>e({...o,advForceBoosters:a}),placeholder:"0",tooltip:"The amount of Advanced Force Boosters equipped. Provides a maximum damage increase of 40% and a melee accuracy penalty of 8%."})]}),n.jsxs("div",{className:"page-input-group",children:[n.jsx(p,{label:"Initial Momentum",disabled:t,value:o.initialMomentum||"",onChange:a=>e({...o,initialMomentum:a}),placeholder:"0",tooltip:"The momentum bonus from movement for the first attack. This should be 0-3."}),n.jsx(p,{label:"Bonus Momentum",disabled:t,value:o.bonusMomentum||"",onChange:a=>e({...o,bonusMomentum:a}),placeholder:"0",tooltip:"The amount of bonus momentum from Reaction Control Systems (Always 0 or 1, no_stack)."}),n.jsx(p,{label:"Speed",disabled:t,value:o.speed||"",onChange:a=>e({...o,speed:a}),placeholder:"100",tooltip:"The speed of Cogmind. Higher speed provides increased momentum bonus damage."}),n.jsx(G,{className:"sneak-attack-select",isDisabled:t,label:"Sneak Attacks",isSearchable:!1,tooltip:"Whether to perform sneak attacks or not. Sneak attacks provide a base hit chance of 120% and double damage.",options:fe,value:fe.find(a=>a.value===o.sneakAttacks)||fe[0],onChange:a=>{e({...o,sneakAttacks:a.value})}})]})]}),H=n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:"page-input-group",children:[n.jsx(p,{label:"Targeting",disabled:t,value:o.targeting||"",onChange:a=>e({...o,targeting:a}),placeholder:"0%",tooltip:"The amount of targeting bonus from Targeting Computers or similar utilities (stacks). Base is 5%, Improved is 6%, Advanced is 8%, Experimental is 12%."}),n.jsx(p,{label:"Recoil Reduction",disabled:t,value:o.recoilReduction||"",onChange:a=>e({...o,recoilReduction:a}),placeholder:"0",tooltip:"The number of recoil reduction. Each tread slot has 1 recoil reduction, Recoil Stabilizers have 4, and Recoil Nullifiers have 6."}),n.jsx(p,{label:"Distance",disabled:t,value:o.distance||"",onChange:a=>e({...o,distance:a}),placeholder:"6+",tooltip:"The distance from the target. Each tile closer than 6 tiles away provides 3% accuracy up to 15% at 1 tile away."}),n.jsx(G,{className:"siege-select",isDisabled:t,label:"Siege",isSearchable:!1,tooltip:"The type of siege mode active (if any). Siege mode removes all recoil and adds a 20% (standard) or 30% (high) bonus to targeting.",options:pe,value:pe.find(a=>a.value===o.siege)||pe[0],onChange:a=>{e({...o,siege:a.value})}})]}),n.jsxs("div",{className:"page-input-group",children:[n.jsx(p,{label:"Particle Charging",disabled:t,value:o.particleCharger||"",onChange:a=>e({...o,particleCharger:a}),placeholder:"0%",tooltip:"The bonus from Particle Charger/Accelerators that are equipped (if any). Increases damage of energy gun/cannon weapons (half_stack). Base charger starts at 15%, going to 20%, 25%, 30%, 40%, and 50%."}),n.jsx(p,{label:"Kinecellerator",value:o.kinecellerator||"",disabled:t,onChange:a=>e({...o,kinecellerator:a}),placeholder:"0%",tooltip:"The bonus from a Kinecellerator that's equipped (if any). INcreases minimum damage of kinetic gun/cannon weapons. Base Kinecellerator starts at 30%, Improved at 40%, and Advanced at 50%."}),n.jsx(p,{label:"Weapon Cycling",disabled:t,value:o.weaponCycling||"",onChange:a=>e({...o,weaponCycling:a}),placeholder:"0%",tooltip:"The percentage of Weapon Cycling or similar utilities that are equipped (if any). Decreases overall volley time. Stacks up to 30%, though a Quantum Capacitor or Launcher Loader can go up to 50%."}),n.jsx(p,{label:"Salvage Targeting",disabled:t,value:o.salvageTargeting||"",onChange:a=>e({...o,salvageTargeting:a}),placeholder:"0%",tooltip:"The bonus of Salvage Targeting Computers that are equipped (if any). Increase salvage generated from Gun-type weapons that fire a single projectile (stacks). Base Salvage Targeting Computer starts at +1, Improved is +2, Advanced is +3, and Makeshift is +4."})]})]}),w=n.jsxs(n.Fragment,{children:[(V=o.weaponState)==null?void 0:V.map((a,B)=>{const F=c.getItem(a.name);return n.jsx(Oo,{disabled:t,pageState:o,updatePageState:e,weaponItem:F,weaponInfo:a,weaponOptions:k,i:B},a.id)}),n.jsx("div",{className:"new-weapon-row",children:n.jsx(G,{label:"Weapon",isDisabled:t,className:"weapon-select",tooltip:"Name of an equipped weapon to fire.",options:k,controlShouldRenderValue:!1,onChange:a=>{const B=[...o.weaponState||[]],F=Math.max(0,...B.map(I=>I.id+1));B.push({name:a.value,id:F}),e({...o,weaponState:B})}})})]});return n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:"page-input-group",children:[n.jsx(_,{label:"Combat Type",disabled:t,buttons:Lo,className:"flex-grow-0",tooltip:"The type of weapons to display. Melee and ranged weapons also have unique utilities and other settings.",selected:o.combatType,onValueChanged:a=>{e({...o,weaponState:[],combatType:a})}}),n.jsx(p,{label:"Num Fights",disabled:t,value:o.numSimulations||"",onChange:a=>e({...o,numSimulations:a}),placeholder:"100,000",tooltip:"The number of fights to simulate. High numbers will increase result accuracy but also increase time to calculate."}),n.jsx(G,{className:"enemy-behavior-select",isDisabled:t,label:"Enemy Behavior",tooltip:"The behavior of the enemy when engaged in combat. THe default for most hostile combat bots is Stand/Fight, and the behavior of most non-combat bots will be RUn When Hit.",isSearchable:!1,options:me,value:me.find(a=>a.value===o.enemyBehavior)||me[0],onChange:a=>{e({...o,enemyBehavior:a.value})}}),n.jsx(Z,{tooltip:"Resets all values to their default state",disabled:t,className:"flex-grow-0",onClick:()=>e({}),children:"Reset"})]}),n.jsxs("div",{className:"page-input-group",children:[n.jsxs("div",{className:"enemy-group",children:[n.jsx(G,{label:"Enemy",className:"enemy-select",isDisabled:t,tooltip:"The name of the enemy bot to fight.",options:f,value:f.find(a=>a.value===x),onChange:a=>{e({...o,botName:a.value})}}),n.jsx(Fo,{bot:i,text:"?",tooltip:"Show details about the bot."})]}),n.jsx(_,{label:"Analysis",buttons:ee,disabled:t,tooltip:"Does Cogmind have the analysis for this bot? An analysis provides bonuses of 5% accuracy and 10% damage.",selected:o.analysis||"No",onValueChanged:a=>{e({...o,analysis:a})}}),n.jsx(G,{label:"Damage Reduction",isDisabled:t,className:"damage-reduction-select",tooltip:"The type of external damage reduction (if any) for the enemy. Note: this does not stack with personal damage reduction utilities.",isSearchable:!1,options:he,value:he.find(a=>a.value===o.damageReduction)||he[0],onChange:a=>{e({...o,damageReduction:a.value})}})]}),n.jsxs("div",{className:"page-input-group",children:[n.jsx(p,{label:"Actions Since Moving",disabled:t,value:o.actionsSinceMoving||"",onChange:a=>e({...o,actionsSinceMoving:a}),placeholder:"2+",tooltip:"The number of actions performed since Cogmind last moved. For melee, there is a +10% accuracy bonus gained after not moving for 2 turns. For ranged, there is an additional -10% penalty if the most recent action was a move. Basically, 0 turns since moving = -10%, 1 turn = 0%, 2 turns = 10%."}),n.jsx(_,{label:"On Legs",disabled:t,buttons:ee,tooltip:"Is Cogmind on legs? If so, the number of tiles run in a row provide an additional 5% penalty per tile moved.",selected:o.onLegs||"No",onValueChanged:a=>{e({...o,onLegs:a})}}),n.jsx(p,{label:"Tiles Run",disabled:t,value:o.tilesRun||"",onChange:a=>e({...o,tilesRun:a}),placeholder:"0",tooltip:"The number of tiles Cogmind has been running for if on legs. There is a -5% penalty per tile moved for ranged weapons, up to a maximum of -15%."})]}),o.combatType==="Melee"?R:H,n.jsxs("div",{className:"page-input-group last-pre-weapon-row",children:[n.jsx(p,{label:"Armor Integrity Analyzer",disabled:t,value:o.armorIntegrityAnalyzer||"",onChange:a=>e({...o,armorIntegrityAnalyzer:a}),placeholder:"0%",tooltip:"The type of armor integrity analyzer that's equipped (if any). Adds a chance of bypassing enemy armor. Values are 30% for basic, 40% for Improved, and 50% for Experimental."}),n.jsx(p,{label:"Core Analyzer",disabled:t,value:o.coreAnalyzer||"",onChange:a=>e({...o,coreAnalyzer:a}),placeholder:"0%",tooltip:"The bonus from one or more Core Analyzers that are equipped (if any). Increases core exposure by the specific amount (half_stack). Base Analyzer is 6% and Experimental is 8%, for a maximum of 12%."}),n.jsx(p,{label:"Target Analyzer",disabled:t,value:o.targetAnalyzer||"",onChange:a=>e({...o,targetAnalyzer:a}),placeholder:"0%",tooltip:"The bonus from one or more Target Analyzers that are equipped (if any). Increases critical hit % chance for weapons with a critical hit (half_stack). Base Analyzer is 5%, Improved is 6%, Advanced is 8%, and Experimental is 10%."})]}),w,n.jsxs("div",{className:"page-input-group",children:[n.jsx(_,{label:"X-Axis",disabled:t,className:"flex-grow-0",buttons:Vo,tooltip:"The type of x-axis to show on the graph.",selected:o.xAxis||"Volleys",onValueChanged:a=>{e({...o,xAxis:a})}}),n.jsx(_,{label:"Show Loot",disabled:t,className:"flex-grow-0",buttons:ee,tooltip:"Whether or not to show estimated loot drops. Expected matter and part drop rate chance and integrity are shown. Crit off rate shows the % of the drop rate that was caused due to blast, sever, or sunder critical hits, if applicable.",selected:o.showLoot||"No",onValueChanged:a=>{e({...o,showLoot:a})}}),n.jsx(G,{label:"End Condition",isDisabled:t,tooltip:"The scenario to occur before the simulation is ended.",isSearchable:!1,options:d,value:d.find(a=>a.value===o.endCondition)||d[0],onChange:a=>{e({...o,endCondition:a.value})}})]})]})}const Ee=["rgba(228, 26, 28, .8)","rgba(55, 126, 184, .8)","rgba(36, 192, 36, .8)","rgba(152, 78, 163, .8)","rgba(255, 127, 0, .8)","rgba(255, 255, 51, .8)","rgba(243, 145, 146, .8)","rgba(145, 187, 222, .8)","rgba(135, 232, 135, .8)","rgba(202, 159, 209, .8)","rgba(255, 194, 133, .8)","rgba(163, 163, 0, .8)"];let ve=!1;function Go(){const o=to(),t=so(o,{});let e;if(t.weaponState!==void 0){const r=ze.decompressFromEncodedURIComponent(t.weaponState);if(r!==null){const c=JSON.parse(r);Array.isArray(c)&&(e=c)}}return{...t,weaponState:e}}const So=/Core Regeneration \((\d*)\)/;function Ho(o){const t=o.traits;for(let e=0;e<t.length;e++){const r=So.exec(t[e]);if(r!=null)return parseInt(r[1])}return 0}function _o(o){let t;if(o.weaponState&&o.weaponState.length>0){const e=JSON.stringify(o.weaponState);t=ze.compressToEncodedURIComponent(e)}return{...o,weaponState:t}}function Uo(o,t,e,r){const c=e.botName||"G-34 Mercenary",y=[];for(const l of e.weaponState??[]){const h=t.tryGetItem(l.name);if(h===void 0||h.slot!=="Weapon"){r(`Item ${l.name} is not a valid weapon, this is probably a bug.`);return}const s=m(l.number,1),T=l.overload==="Yes",A=l.exo==="Yes";for(let q=0;q<s;q++)y.push({def:h,overloaded:T||A})}if(y.length===0){r("There must be at least 1 weapon selected.");return}const f=[];let k=0;function x(l,h){const s=l.type==="Protection",T=l.type==="Treads",A=l.coverage??0,q=s||T?2*A:A;f.push({armorAnalyzedCoverage:s?0:A,armorAnalyzedSiegedCoverage:s?0:q,coverage:A,def:l,integrity:h,initialIndex:k++,protection:s,selfDamageReduction:1,siegedCoverage:q})}let i,d,R,H;if(i=o.getBotOrNull(c),!i){r(`Bot ${c} is invalid, this is probably a bug.`);return}i.componentData.concat(i.armamentData).concat(i.componentOptionData.map(l=>l[0])).concat(i.armamentOptionData.map(l=>l[0])).forEach(l=>{for(let h=0;h<l.number;h++){const s=t.getItem(l.name);x(s,s.integrity)}}),d=i.coreCoverage,H=i.totalCoverage,R=i.coreIntegrity;const w=d+f.reduce((l,h)=>l+h.armorAnalyzedCoverage,0),V=d+f.reduce((l,h)=>l+h.siegedCoverage,0),a=d+f.reduce((l,h)=>l+h.siegedCoverage,0),B=e.enemyBehavior||"Stand/Fight",F=lo(f,e.damageReduction||"None");let I=0;i.speed<100?I=Math.trunc((100-i.speed)/5):I=0;const oe=B==="Already Sieged/Fight"&&f.find(l=>l.def.type==="Treads"&&l.def.siege!==void 0)!==void 0,U={armorAnalyzedCoverage:w,armorAnalyzedSiegedCoverage:V,behavior:B,coreCoverage:d,coreDisrupted:!1,coreIntegrity:R,corruption:0,def:i,defensiveState:F,externalDamageReduction:e.damageReduction||"None",immunities:i.immunities,initialCoreIntegrity:R,parts:f,regen:Ho(i),resistances:i.resistances===void 0?{}:i.resistances,running:B==="Running",runningEvasion:I,runningMomentum:B==="Running"?3:0,salvage:0,sieged:oe,siegedCoverage:a,totalCoverage:H,tusToSiege:B==="Siege/Fight"?500:0};let ae=!1;const j=e.combatType==="Melee",ne={bonus:0,tus:0},le=j?ne:ro.get(e.siege)||ne;let $=0;j||($=m(e.targeting,0));const u=[m(e.baseMas,0),m(e.impMas,0),m(e.advMas,0),m(e.expMas,0)],v=[m(e.baseForceBoosters,0),m(e.impForceBoosters,0),m(e.advForceBoosters,0)];if(j){let l=2;for(let h=v.length-1;h>=0;h--)v[h]>l?(v[h]=l,l=0):l-=v[h]}let C=m(e.distance,6);C<=1&&(C=1);const b=m(e.recoilReduction,0),N=y.reduce((l,h)=>co(h.def,b)+l,0),M=m(e.targetAnalyzer,0),g=m(e.salvageTargeting,0),D=y.map((l,h)=>{const s=l.def;let T=0,A=0,q,ie=0,re=0,Ne;if(s.damage!==void 0){if(s.damage.includes("-")){const L=s.damage.split("-");T=parseInt(L[0]),A=parseInt(L[1])}else T=parseInt(s.damage),A=T;if(s.type==="Ballistic Gun"||s.type==="Ballistic Cannon"){const L=m(e.kinecellerator,0);T=Math.trunc(T*(1+L/100)),T>A&&(A=T)}else if(j){let L=0;for(let z=0;z<ke.length;z++)L+=u[z]*ke[z];T=Math.min(L+T,A);let de=0,ue=0;for(let z=v.length-1;z>=0;z--)v[z]==2?(de=1.5*Re[z],ue+=2):v[z]==1&&(de+=Re[z]*(ue==0?1:.5),ue+=1);A=Math.floor(A*(1+de))}q=s.damageType}if(s.explosionDamage!==void 0){if(s.explosionDamage.includes("-")){const L=s.explosionDamage.split("-");ie=parseInt(L[0]),re=parseInt(L[1])}else ie=parseInt(s.explosionDamage),re=ie;Ne=s.explosionType}let ce;s.criticalType===go.Meltdown?ce=s.critical:ce=s.critical===void 0||s.critical===0?0:s.critical+M;let J=j?fo:vo;j||(J+=$),Be.has(i.size)?J+=Be.get(i.size):console.log(`${c} has invalid size ${i.size}`),s.targeting!==void 0&&(J+=s.targeting);const Ue=m(s.delay,0);j&&h!=0&&(J+=10);const $e=s.disruption??0,Ye=s.explosionDisruption??0,Xe=De(s.spectrum),Je=De(s.explosionSpectrum),Qe=s.minChunks??1,Ze=s.maxChunks??1;s.name==="Ram"&&(ae=!0);const Pe=s.type==="Launcher"&&s.name!="Sigix Terminator"&&s.name!="Supercharged Sigix Terminator"&&s.name!="Vortex Catalyst Activator";let je=s.salvage??0;return g>0&&s.projectileCount==1&&(s.type==="Ballistic Gun"||s.type==="Energy Gun")&&(je+=g),{accelerated:s.type==="Energy Gun"||s.type==="Energy Cannon",accuracy:J,baseAccuracy:J,criticalChance:ce,criticalType:s.criticalType,damageMin:T,damageMax:A,damageType:q,def:s,delay:Ue,disruption:$e,explosionChunksMin:Qe,explosionChunksMax:Ze,explosionDisruption:Ye,explosionMin:ie,explosionMax:re,explosionSpectrum:Je,explosionType:Ne,isMissile:Pe,numProjectiles:s.projectileCount,overflow:!s.type.includes("Gun"),overloaded:l.overloaded,salvage:je,spectrum:Xe}}),E=1+Math.max(m(e.particleCharger,0),0)/100,W=m(e.armorIntegrityAnalyzer,0),K=m(e.coreAnalyzer,0),Y=m(e.actuatorArray,0),O=[];if(j){const l=20+Y;D.forEach((h,s)=>{if(s!=0){let T=l+Math.trunc((D[0].delay-h.delay)/10);T=Math.min(T,100),T=Math.max(T,0),O.push(T)}})}const X=m(e.speed,100),ge=m(e.bonusMomentum,0),ye=m(e.initialMomentum,0),Ke=e.sneakAttacks||"None",Oe=Math.max(0,Math.min(99,m(e.actuator,0))),qe=Math.max(0,Math.min(99,m(e.weaponCycling,0))),xe=1-(j?Oe:qe)/100,Ge=j?D[0].delay+uo[1]:mo(D.map(l=>l.def),xe);let P,se;const Ce=m(e.actionsSinceMoving,2);Ce==0?(P=j?0:-10,se=0):Ce==1?(P=0,se=10):(P=10,se=10);const Te=e.onLegs==="Yes"?m(e.tilesRun,0):0;Te>0&&!j&&(P-=Math.min(Te,3)*5);const we=[];for(const l of U.parts)we.push({item:l.def,numDrops:0,totalCritRemoves:0,totalCorruptionPercent:0,totalFried:0,totalIntegrity:0});const Se={numKills:0,items:we,matterBlasted:0,matterDrop:0},He={action1Accuracy:P,action2Accuracy:se,armorAnalyzerChance:W,analysis:e.analysis==="Yes",chargerBonus:E,coreAnalyzerChance:K,distance:C,followupChances:O,forceBoosters:v,melee:j,meleeAnalysis:u,momentum:{bonus:ge,current:ge+ye,initial:ye},ramming:ae,recoil:N,recoilReduction:b,siegeBonus:le,sneakAttack:!1,sneakAttackStrategy:Ke,speed:X,targetingComputerBonus:$,volleyTime:Ge,volleyTimeModifier:xe},_e=e.endCondition||"Kill";return{actionNum:0,botState:U,endCondition:_e,initialBotState:U,killTus:{},killVolleys:{},lootState:Se,offensiveState:He,tus:0,weapons:D}}function $o(o,t){const e=o;return e==="analysis"&&t.analysis==="No"||e==="combatType"&&t.combatType==="Ranged"||e==="damageReduction"&&t.damageReduction==="None"||e==="endCondition"&&t.endCondition==="Kill"||e==="enemyBehavior"&&t.enemyBehavior==="Stand/Fight"||e==="onLegs"&&t.onLegs==="No"||e==="siege"&&t.siege==="No Siege"||e==="xAxis"&&t.xAxis==="Volleys"}function ca(){var $;const[o,t]=ao(),e=Ve(),r=Le(),c=Go(),[y,f]=S.useState(!1),[k,x]=S.useState(""),[i,d]=S.useState(void 0),[R,H]=S.useState(""),[w,V]=S.useState({comparisonChartName:"",datasets:[]}),a=S.useRef(null);function B(u){const v=_o(u),C=io("/simulator",v,$o);t(C,{replace:!0})}const F=m(($=c.numSimulations)==null?void 0:$.replace(",",""),1e5);let I,oe,U;if(i!==void 0){let u,v,C,b;c.xAxis==="Time"?(u=`Time Units/Kill vs ${i.botName}`,C=i.cumulativeKillPerTuData,v=i.killPerTuData,b="Number of Volleys"):(u=`Volleys/Kill vs ${i.botName}`,C=i.cumulativeKillPerVolleyData,v=i.killPerVolleyData,b="Number of Time Units"),I=n.jsx("div",{className:"chart-container",children:n.jsx(Fe,{backgroundColors:["rgba(0, 98, 0, 0.3)","rgba(96, 96, 96, .3)"],borderColors:["rgba(0, 196, 0, 1)","rgba(128, 128, 128, 1)"],chartTitle:u,isPercentage:!0,values:[{label:"Current volley kill %",values:v},{label:"Cumulative Kill %",values:C}],xLabel:b,yLabel:"Percent of Kills"})}),oe=n.jsxs("div",{className:"page-input-group",children:[n.jsx(p,{label:"Dataset Name",value:R||"",onChange:N=>H(N),placeholder:"Enter dataset name",tooltip:"The name for this dataset when added to the custom comparison chart. Can be renamed once added."}),n.jsx(Z,{className:"flex-grow-0",onClick:()=>{let N={...w};const M=new Array(Ee.length).fill(0);for(const E of w.datasets)M[E.colorIndex]+=1;let g=0,D;for(;D=M.indexOf(g),!(D>=0);)g+=1;const te=w.datasets.length===0?0:Math.max(...w.datasets.map(E=>E.id))+1;N.datasets=[...w.datasets,{colorIndex:D,data:i.comparisonData,id:te,name:R}],V(N),H("")},disabled:R==="",children:"Add To Comparison"})]})}if(w.datasets.length>0){let u=[],v=[],C=[];for(const b of w.datasets)u.push("rgba(0, 0, 0, 0)"),v.push(Ee[b.colorIndex]),C.push({id:b.id.toString(),label:b.name,values:b.data});U=n.jsxs(n.Fragment,{children:[n.jsx("div",{className:"page-input-group",children:n.jsx(p,{label:"Chart Name",value:w.comparisonChartName||"",onChange:b=>V({...w,comparisonChartName:b}),placeholder:"Custom Comparison",tooltip:"The name for this dataset when added to the custom comparison chart. Can be renamed once added."})}),n.jsx("div",{className:"custom-dataset-groups",children:w.datasets.map((b,N)=>n.jsxs("div",{children:[n.jsx(no,{onChange:M=>{const g=[...w.datasets];g[N]={...g[N],name:M},V({...w,datasets:g})},value:b.name}),n.jsx(Z,{onClick:()=>{const M=[...w.datasets];M.splice(N,1),V({...w,datasets:M})},children:"X"})]},b.id))}),n.jsx("div",{className:"chart-container",children:n.jsx(Fe,{backgroundColors:u,borderColors:v,chartTitle:w.comparisonChartName||"Custom Comparison",isPercentage:!0,values:C,xLabel:"Number of Time Units",yLabel:"Percent of Kills"})})]})}function ae(){let u=0;const v=performance.now();let C=v,b=C;const N=Uo(e,r,c,x);if(N===void 0){f(!1);return}function M(){for(;u<F;u++){if(ve)return;if(u%100===0){const g=performance.now();if(g-C>30){if(C=g,g-b>100){const D=(u*100/F).toFixed(1);a.current.innerHTML=`${String(D).padStart(4,"0")} % completed.`,b=g}setTimeout(M,0);break}}try{if(!ho(N)){x(`The simulation exceeded ${po} volleys and will likely never kill.`),f(!1);return}}catch(g){console.log(g),x("The simulation encountered an unexpected error, this is a bug."),f(!1);return}}if(u>=F){let g=performance.now()-v;g/=1e3,x(`Completed in ${g.toFixed(2)} seconds.`),f(!1),ne(N)}}ve=!1,f(!0),M()}function j(){ve=!0,f(!1),x("Simulation cancelled"),a.current.innerHTML="Simulation cancelled"}function ne(u){function v(E,W,K,Y){const O=E.filter(X=>W[X]/F>Math.pow(10,-2-K)).map(X=>({x:parseInt(X),y:Math.trunc(W[X]/F*Math.pow(10,2+K))/Math.pow(10,K)}));return O.length<5&&O.push({x:O[O.length-1].x+Y,y:0}),O}function C(E){const W=[];let K=0;return E.forEach(Y=>{K+=Y.y,W.push({x:Y.x,y:Math.trunc(K*100)/100})}),W}const b=Object.keys(u.killTus);b.sort((E,W)=>parseFloat(E)-parseFloat(W));const N=C(v(b,u.killTus,u.offensiveState.melee?3:1,100)),M=v(Object.keys(u.killVolleys),u.killVolleys,1,1),g=v(b,u.killTus,u.offensiveState.melee?3:1,u.offensiveState.volleyTime),D=C(M),te=C(g);d({botName:c.botName||"G-34 Mercenary",comparisonData:N,cumulativeKillPerTuData:te,cumulativeKillPerVolleyData:D,killPerTuData:g,killPerVolleyData:M,volleyTime:u.offensiveState.volleyTime})}const le=y?n.jsx(Z,{className:"simulate-button",tooltip:"Cancels the running simulation",onClick:j,children:"Cancel"}):n.jsx(Z,{className:"simulate-button",tooltip:"Run the simulation",onClick:ae,children:"Simulate"});return n.jsxs("div",{className:"page-content",children:[n.jsx(qo,{pageState:c,simulationInProgress:y,updatePageState:B}),n.jsxs("div",{className:"simulate-row",children:[le,n.jsx("label",{ref:a,className:"status-text",children:k})]}),I,oe,U]})}export{ca as default,Ho as getRegen};
