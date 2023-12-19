import"./common-BJ5vf-Kh.js";/* empty css              */import{j as D,c as v,a as R}from"./commonJquery-7AX1KuXJ.js";const k=[{Name:"Alert ID Control",MinAbilities:"0",Levels:"1",Description:"Block the influence of kills by allied former 0b10 bots while matching Coupler attached."},{Name:"Autoassimilate",MinAbilities:"3",Levels:"2",Description:"(10/15)% chance to automatically rewrite all target system data, permanently converting it into a fully controllable ally. Requires 6 turns to complete the process. Checked once per visible combat bot while matching Coupler attached, separately for each Coupler."},{Name:"Autooverride",MinAbilities:"2",Levels:"3",Description:"(10/20/30)% chance to automatically trick target system into believing it is allied with Cogmind. After 10 turns the network will perform an automated quickboot to restore it to normal, a process which takes anywhre from 5 to 10 turns. Checked once per visible combat bot while matching Coupler attached, separately for each Coupler."},{Name:"Code Merge",MinAbilities:"4",Levels:"2",Description:"Stand on a Coupler and use > or right-click on self to add (30/50)% of its code value to a matching attached Coupler. Cannot increase value beyond 99."},{Name:"Command Fork",MinAbilities:"0",Levels:"3",Description:"(33/66/100)% chance to duplicate each hack, also applying it to the visible applicable target nearest to the initial target, at no extra cost. Must have a matching Coupler attached for the fork target. Compatible with most hacks, excluding generate_echo, map_walls, map_earth, map_route, or those that would have no meaningful effect."},{Name:"Coupler Efficiency",MinAbilities:"0",Levels:"3",Description:"+(6/12/20) effective code value to all Relay Couplers."},{Name:"Crosswire",MinAbilities:"7",Levels:"1",Description:"Convert Swarmer, Grunt, Brawler, and Duelist Couplers to Relay Coupler [C], usable on any common 0b10 bot of these types."},{Name:"Hotswap",MinAbilities:"0",Levels:"1",Description:"Automatically swap in additional matching couplers in sequence from inventory when effective code value of current attached Couplers insufficient for desired hack."},{Name:"Patrol Navigation",MinAbilities:"0",Levels:"1",Description:"Know routes of patrol squads within a range of 24 while matching Coupler attached."},{Name:"Program Shield",MinAbilities:"0",Levels:"1",Description:"Fully prevent Programmers from hacking allied former 0b10 combat bots while matching Coupler attached (no range or sight limitations)."},{Name:"Robot Detection",MinAbilities:"0",Levels:"1",Description:"Know positions of combat bots within a range of 24 while matching Coupler attached. Also distinguishes squad leaders (L)."},{Name:"Signal Jamming",MinAbilities:"0",Levels:"1",Description:"Blocks local transmissions from visible hostiles while matching Coupler attached, making it impossible for them to share information about your current position. Also prevents calls for reinforcements, and suppresses alarm traps."},{Name:"Structural Interface",MinAbilities:"0",Levels:"1",Description:"Reveal any hidden door or phasewall on sight, and pass through phasewalls normally."},{Name:"Threat Obfuscation",MinAbilities:"0",Levels:"3",Description:"All influence increases reduced by (25/40/50)%."},{Name:"Watcher Feeds",MinAbilities:"0",Levels:"1",Description:"Tap into visual feed data of all 0b10 watchers within a range of 22 while at least one Relay Coupler [NC] is attached."},{Name:"Zone Cloak",MinAbilities:"0",Levels:"2",Description:"Extermination squads require an average (75/150) more turns before they can pinpoint your position for dispatching."}],_=[{CategoryName:"Combat",Targets:["Alpha 7 (Prototype)","Behemoth","Brawler","Cutter","Demolisher","Duelist","Executioner (Prototype)","Fortress (Prototype)","Grunt","Heavy","Hunter","Programmer","Sentry","Specialist","Striker (Prototype)","Swarmer"],Hacks:[{Name:"parse_system",Rif:!1,Charges:0,Description:"Read system data to learn more about its current state and capabilities. Also identifies all parts, and adds them to the item gallery if not already there. Parsing friendlies will not anger them."},{Name:"find_shortcuts",Rif:!0,Charges:1,Description:"Reveal and label all hidden doors within a range of 50."},{Name:"focus_fire",Rif:!0,Charges:1,Description:"Force system to prioritize attacking Cogmind whenever possible."},{Name:"scatter_targeting",Rif:!0,Charges:1,Description:"Offset targeting algorithms to approximately halve their chance of achieving optimal aim."},{Name:"reboot_propulsion",Rif:!0,Charges:2,Description:"Render propulsion unusable for 15 turns while the control subsystem reboots."},{Name:"mark_system",Rif:!0,Charges:2,Description:"Mark this bot to make it the most attractive target to all allies, as well as improve accuracy against it by 10%."},{Name:"spike_heat",Rif:!0,Charges:2,Description:"Destabilize power systemt to induce a massive surge of heat."},{Name:"wipe_record",Rif:!0,Charges:2,Description:"Remove any record of Cogmind from memory, and block new Cogmind records from being created for 10 turns."},{Name:"tweak_propulsion",Rif:!0,Charges:3,Description:"Rewrite sections of the propulsion control subsystem to permanently halve movement speed."},{Name:"link_complan",Rif:!0,Charges:3,Description:"Tap into system's combat decision-making processes in real time, increasing your accuracy and damage against this bot by 25% while also impairing its accuracy against you by 25%."},{Name:"broadcast_data",Rif:!0,Charges:3,Description:"Openly share the local combat network's defensive coordination values, giving yourself and all allies 25% better accuracy against this and all 0b10 combat bots within a range of 3. Effect stacks when installed on multiple bots."},{Name:"disrupt_area",Rif:!0,Charges:3,Description:"Actively interface with the local combat network's offensive coordination calculations, reducing the accuracy of this bot by 25%, and that of all 0b10 combat bots within a range of 3. Effect stacks when installed on multiple bots."},{Name:"overload_power",Rif:!0,Charges:3,Description:"Cause power source to explode. Process takes 4-6 turns to reach critical point."},{Name:"find_garrison",Rif:!0,Charges:4,Description:"Locate the nearest garrison access."},{Name:"show_paths",Rif:!0,Charges:4,Description:"Highlight all current patrol squad routes. Only effective when targeting a patrol squad leader."},{Name:"link_fov",Rif:!0,Charges:4,Description:"Tap into system's visual feed for 100 turns. Must remain within a range of 20 to maintain the link."},{Name:"disable_weapons",Rif:!0,Charges:4,Description:"Disable all weapon systems for 20 turns."},{Name:"reboot_system",Rif:!0,Charges:4,Description:"Force a complete reboot. The entire sequence requires anywhere from 15 to 25 turns to complete."},{Name:"go_dormant",Rif:!0,Charges:4,Description:"Wipe memory and force immediate dormant state."},{Name:"amplify_resonance",Rif:!0,Charges:7,Description:"Cause power source to explode when adjacent to any other active power source. Also causes the adjacent active power source to explode. Checked once per turn."},{Name:"overwrite_iff",Rif:!0,Charges:7,Description:"Trick system into believing it is allied with Cogmind. After 10 turns the network will perform an automated quickboot to restore it to normal, a process which takes anywhere from 5 to 10 turns."},{Name:"streamctrl_high",Rif:!0,Charges:10,Description:"Hijack the control node to force system to act as an ally. Must remain within a range of 5 to maintain the connection. This bot will follow while in this mode."},{Name:"formatsys_high",Rif:!0,Charges:13,Description:"Rewrite all system data, permanently converting it into a fully controllable ally. Requires 6 turns to complete the process."}]},{CategoryName:"Noncombat (NC) Yellow",Targets:["Carrier","Operator","Researcher","Watcher"],Hacks:[{Name:"parse_system",Rif:!1,Charges:0,Description:"Read system data to learn more about its current state and capabilities. Also identifies all parts, and adds them to the item gallery if not already there. Parsing friendlies will not anger them."},{Name:"overload_power",Rif:!0,Charges:3,Description:"Cause power source to explode. Process takes 4-6 turns to reach critical point."},{Name:"link_fov",Rif:!0,Charges:4,Description:"Tap into system's visual feed for 100 turns. Must remain within a range of 20 to maintain the link."},{Name:"streamctrl_high",Rif:!0,Charges:10,Description:"Hijack the control node to force system to act as an ally. Must remain within a range of 5 to maintain the connection. This bot will follow while in this mode."},{Name:"formatsys_high",Rif:!0,Charges:13,Description:"Rewrite all system data, permanently converting it into a fully controllable ally. Requires 6 turns to complete the process."}]},{CategoryName:"Noncombat (NC) Green",Targets:["Builder","Hauler","Mechanic","Minesweeper","Operator","Protector","Recycler","Tunneler","Worker"],Hacks:[{Name:"parse_system",Rif:!1,Charges:0,Description:"Read system data to learn more about its current state and capabilities. Also identifies all parts, and adds them to the item gallery if not already there. Parsing friendlies will not anger them."},{Name:"no_distress",Rif:!1,Charges:0,Description:"Prevent this system from generating distress signals."},{Name:"generate_echo",Rif:!0,Charges:1,Description:"Destabilize power systems to generate a wave of energy which can be analyzer to temporarily pinpoint robots at a distance. Beyond a range of 20 the echo becomes to weak to be useful."},{Name:"overload_power",Rif:!0,Charges:3,Description:"Cause power source to explode. Process takes 4-6 turns to reach critical point."},{Name:"link_fov",Rif:!0,Charges:4,Description:"Tap into system's visual feed for 100 turns. Must remain within a range of 20 to maintain the link."},{Name:"streamctrl_low",Rif:!0,Charges:4,Description:"Hijack the control node to force system to act as an ally. Must remain within a range of 5 to maintain the connection. This bot will follow while in this mode."},{Name:"generate_anomaly",Rif:!0,Charges:5,Description:"Induce an energy anomaly resembling a long-range distress signal that will attract nearby patrols and Sentries/Heavies to investigate. Anomaly detectable up to a range of 15."},{Name:"amplify_resonance",Rif:!0,Charges:7,Description:"Cause power source to explode when adjacent to any other active power source. Also causes the adjacent active power source to explode. Checked once per turn."},{Name:"formatsys_low",Rif:!0,Charges:7,Description:"Rewrite all system data, permanently converting it into a fully controllable ally. Requires 6 turns to complete the process."},{Name:"start_evac",Rif:!0,Charges:10,Description:"Instruct system to follow local evacuation protocols by heading to another 0b10-controlled level."}]},{CategoryName:"Carrier",Targets:["Carrier"],Hacks:[{Name:"emergency_deploy",Rif:!0,Charges:15,Description:"Forces emergency deployment, likely damaging or destroying the bots contained within."},{Name:"formatsys_deep",Rif:!0,Charges:40,Description:"Rewrite all system data, permanently converting it into a fully controllable ally. Requires 6 turns to complete the process. Also fully penetrates systems of all bots contained within."}]},{CategoryName:"Compactor",Targets:["Compactor"],Hacks:[{Name:"ignore_targets",Rif:!0,Charges:3,Description:"Block system messages regarding waste processing targets."},{Name:"overload_power",Rif:!0,Charges:3,Description:"Cause power source to explode. Process takes 4-6 turns to reach critical point."},{Name:"link_fov",Rif:!0,Charges:4,Description:"Tap into system's visual feed for 100 turns. Must remain within a range of 20 to maintain the link."},{Name:"amplify_resonance",Rif:!0,Charges:7,Description:"Cause power source to explode when adjacent to any other active power source. Also causes the adjacent active power source to explode. Checked once per turn."}]},{CategoryName:"Engineer",Targets:["Builder"],Hacks:[{Name:"ignore_repairs",Rif:!0,Charges:0,Description:"Block system messages regarding the repair queue."},{Name:"map_walls",Rif:!0,Charges:2,Description:"Reveal all walls and emergency access points within a range of 25."}]},{CategoryName:"Hauler",Targets:["Hauler"],Hacks:[{Name:"find_fabricator",Rif:!1,Charges:0,Description:"Locate the nearest Fabricator."},{Name:"find_dsf",Rif:!1,Charges:0,Description:"Locate the nearest DSF."},{Name:"drop_inventory",Rif:!0,Charges:3,Description:"Force a complete inventory dump, fully identifying contents in the process."},{Name:"recall_reinforcements",Rif:!0,Charges:3,Description:"Recall reinforcement squad requested by this Hauler."},{Name:"locate_stockpiles",Rif:!0,Charges:10,Description:"Mark all common part stockpiles."}]},{CategoryName:"Mechanic",Targets:["Mechanic"],Hacks:[{Name:"find_station",Rif:!1,Charges:0,Description:"Locate the nearest Repair Station."},{Name:"release_backups",Rif:!0,Charges:2,Description:"Force the system to release all backup parts from compressed internal storage."},{Name:"deconstruct_bot",Rif:!0,Charges:3,Description:"Disassemble the nearest allied visible non-huge non-prototype 0b10 bot into its constituent parts."}]},{CategoryName:"Operator",Targets:["Operator"],Hacks:[{Name:"check_alert",Rif:!1,Charges:0,Description:"Query system for current alert level."},{Name:"disarm_traps",Rif:!0,Charges:1,Description:"Disarm the nearest trap array within a range of 30."},{Name:"clear_repairs",Rif:!0,Charges:1,Description:"Clear the sector-wide repair queue and any pending Builder orders."},{Name:"clear_recycling",Rif:!0,Charges:1,Description:"Clear the sector-wide part collection queue and any pending Recycler order."},{Name:"reprogram_traps",Rif:!0,Charges:2,Description:"Reveal and reprogram the nearest trap array within a range of 30."},{Name:"locate_traps",Rif:!0,Charges:3,Description:"Reveal and mark all traps within a range of 30."},{Name:"block_reporting",Rif:!0,Charges:3,Description:"Block ability to report hostiles at a Terminal."},{Name:"find_terminal",Rif:!0,Charges:4,Description:"Locate the nearest Terminal."},{Name:"summon_haulers",Rif:!0,Charges:5,Description:"Force system's call for reinforcements to instead redirect any Haulers within a range of 50."},{Name:"recall_investigation",Rif:!0,Charges:6,Description:"Recall the most recently dispatched investigation squad."},{Name:"purge_threat",Rif:!0,Charges:10,Description:"Lower the alert influence by 150 initially. Subsequent purges reduce alert by 125, 100, 75, and finally stops at 50."}]},{CategoryName:"Serf",Targets:["Worker"],Hacks:[{Name:"find_chute",Rif:!1,Charges:0,Description:"Reveal and mark the chute this Worker might use if immediately tasked with disposal."},{Name:"deconstruct_machine",Rif:!0,Charges:2,Description:"Dismantle the nearest non-interactive machine."},{Name:"hold_bot",Rif:!0,Charges:4,Description:"Latch onto the nearest visible non-prototype 0b10 bot to hold it in place. This task is automatically cancelled after 25 turns."},{Name:"start_disposal",Rif:!0,Charges:6,Description:"Dispose of currently held bot via a chut, if possible. Huge bots are too large to push."}]},{CategoryName:"Recycler",Targets:["Recycler"],Hacks:[{Name:"find_recycling",Rif:!1,Charges:0,Description:"Locate the nearest Recycling Unit."},{Name:"ignore_parts",Rif:!0,Charges:0,Description:"Block system messages regarding the part collection queue."}]},{CategoryName:"Researcher",Targets:["Researcher"],Hacks:[{Name:"find_scanalyzer",Rif:!1,Charges:0,Description:"Locate the nearest Scanalyzer."},{Name:"report_prototypes",Rif:!0,Charges:3,Description:"Force system to reveal 10 new prototype IDs."},{Name:"report_analyses",Rif:!0,Charges:3,Description:"Force system to reveal 3 new robot analyses."},{Name:"disable_scanner",Rif:!0,Charges:4,Description:"Permanently disable an active stasis system to prevent scanning ana analysis."},{Name:"report_schematics",Rif:!0,Charges:4,Description:"Force system to reveal 10 new part schematics."},{Name:"locate_prototypes",Rif:!0,Charges:10,Description:"Mark all prototypes and alien tech within a range of 20, also providing their IDs."}]},{CategoryName:"Excavator",Targets:["Tunneler"],Hacks:[{Name:"map_earth",Rif:!0,Charges:2,Description:"Reveal all earth within a range of 25."},{Name:"randomize_corridors",Rif:!0,Charges:4,Description:"Permanently add new paths to the local complex layout."}]},{CategoryName:"Watcher",Targets:["Watcher"],Hacks:[{Name:"mark_security",Rif:!0,Charges:2,Description:"Mark all active security positions within a range of 40."},{Name:"relay_feed",Rif:!0,Charges:5,Description:"Permanently hook into the sensor feed system, receiving scan data transmissions from up to a range of 20 from Watcher's position."},{Name:"map_route",Rif:!0,Charges:10,Description:"Show scan information from along this Watcher's patrol route."}]}],d={Abilities:k,Hacks:_},T=D.noConflict();T(function(e){e(()=>y());function y(){v("RIF",e("#headerContainer")),R(e(document)),o(),e("#reset").on("click",()=>{e("#reset").tooltip("hide"),o()}),e("#abilityNameInput").on("input",r),e("#abilityDescriptionInput").on("input",r),e("#hackNameInput").on("input",r),e("#hackDescriptionInput").on("input",r),e("#hackTargetInput").on("input",r),r(),e('[data-toggle="tooltip"]').tooltip()}function o(){e("#abilityNameInput").val(""),e("#abilityDescriptionInput").val(""),e("#hackNameInput").val(""),e("#hackDescriptionInput").val(""),e("#hackTargetInput").val(""),r()}function r(){const n=e("#rifAbilityTableBody");n.empty();const l=e("#abilityNameInput").val().toLowerCase(),C=l.length>0,c=e("#abilityDescriptionInput").val().toLowerCase(),b=c.length>0,m=e("#hackNameInput").val().toLowerCase(),p=m.length>0,h=e("#hackDescriptionInput").val().toLowerCase(),u=h.length>0,s=e("#hackTargetInput").val().toLowerCase(),f=s.length>0;if(p||u||f)e("#abilityTable").addClass("not-visible");else{e("#abilityTable").removeClass("not-visible");const i=d.Abilities.filter(a=>!(C&&!a.Name.toLowerCase().includes(l)||b&&!a.Description.toLowerCase().includes(c))).map(a=>`<tr>
                    <td>${a.Name}</td>
                    <td class="sans-serif-font">${a.MinAbilities}</td>
                    <td class="sans-serif-font">${a.Levels}</td>
                    <td class="sans-serif-font">${a.Description}</td>
                    </tr>`).join("");n.append(e(i))}const g=e("#rifHacksTableBody");g.empty();const w=d.Hacks.map(i=>{if(f&&!i.CategoryName.toLowerCase().includes(s)&&i.Targets.find(t=>t.toLowerCase().includes(s))===void 0)return"";const a=i.Hacks.filter(t=>!(p&&!t.Name.toLowerCase().includes(m)||u&&!t.Description.toLowerCase().includes(h))).map(t=>`<tr>
                    <td>${t.Name}</td>
                    <td class="sans-serif-font">${t.Rif?"Yes":"No"}</td>
                    <td class="sans-serif-font">${t.Charges}</td>
                    <td class="sans-serif-font">${t.Description}</td>
                    </tr>`).join("");if(a.length===0)return"";const N=i.Targets.map(t=>`<img src="../game_sprites/${t}.png" title="${t}"/>`).join(" ");return`<tr>
                <td class="rif-hacks-target-row">
                    <p>${i.CategoryName}</p>
                </td>
                <td class="rif-hacks-target-row" colspan="3">
                    ${N}
                </td>
            </tr>`+a}).join("");g.append(e(w))}});
