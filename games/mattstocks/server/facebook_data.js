const data = [
[177.47, 15226540],
[183.01, 8581544],
[182.19, 12797690],
[184.31, 14843310],
[181.06, 8807701],
[180.87, 12768840],
[185.32, 9213801],
[184.82, 7502820],
[182.72, 10351980],
[185.3, 10485370],
[186.99, 12953110],
[186.27, 16746900],
[180.73, 17628140],
[181.54, 16833350],
[188.34, 12578510],
[188.65, 12967030],
[189.54, 12505740],
[189.77, 16253000],
[193.88, 13994930],
[195.47, 14575430],
[192.53, 13209450],
[193.03, 15996650],
[193.4, 23309400],
[194.78, 19538750],
[191.49, 21947170],
[193.26, 54088650],
[182.58, 34957090],
[183.78, 19631900],
[181.44, 13348950],
[178.28, 11639990],
[178.78, 9520718],
[178.87, 11185690],
[179.65, 10827980],
[179.1, 12321770],
[177.51, 8048582],
[177.82, 11684940],
[177.58, 19599420],
[174.93, 7287902],
[175.72, 9499559],
[176.02, 17768670],
[173.54, 27380570],
[174.2, 23926430],
[168.7, 10122200],
[166.69, 13450640],
[165.55, 10457910],
[165.87, 10603100],
[167.68, 15274610],
[166.29, 12306150],
[164.34, 16375210],
[166.08, 16049850],
[165.44, 19934930],
[161.57, 24608800],
[160.47, 35094650],
[165.98, 37088870],
[170.17, 17882100],
[173.37, 11514940],
[171.92, 12136730],
[172.07, 18534610],
[169.6, 12737410],
[169.13, 18200280],
[172.51, 20775850],
[171.26, 26581790],
[167.37, 18864670],
[162.28, 11022100],
[161.45, 11083060],
[162.81, 12685830],
[164.13, 13630540],
[164.62, 17615000],
[161.89, 15845990],
[160.04, 15455630],
[162.56, 11758420],
[162.29, 14320590],
[162.5, 15485430],
[163.95, 12696560],
[164.07, 14168500],
[165.04, 16241390],
[165.79, 12694750],
[167.33, 12485700],
[166.38, 17206800],
[170.49, 13254460],
[171.16, 21723960],
[169.25, 19980980],
[165.71, 30742790],
[166.69, 77005780],
[150.42, 41676170],
[144.19, 17451800],
[147.47, 15242960],
[149.01, 22227160],
[145.83, 20932280],
[144.3, 20060100],
[147.57, 22310570],
[150.04, 30631520],
[148.3, 15480790],
[147.54, 17977150],
[148.95, 24036820],
[145.39, 19864680],
[143.8, 12780600],
[144.2, 16057330],
[144.23, 22131500],
[142.53, 26191030],
[138.05, 19988840],
[137.95, 27973370],
[131.74, 22448730],
[135.68, 27967450],
[131.09, 24552820],
[133.2, 22351260],
[134.52, 30305940],
[134.18, 39526860],
[124.06, 22066000],
[124.95, 56624760],
[133.4, 40202130],
[133.24, 57110060],
[143.66, 23678090],
[140.19, 23838160],
[144.06, 21773500],
[145.01, 18090420],
[144.5, 23349970],
[142.08, 19429850],
[141.85, 26315700],
[137.42, 20583170],
[139.63, 27625310],
[137.93, 30227750],
[141.09, 24697080],
[140.61, 25716150],
[138.68, 23935390],
[136.76, 28701670],
[135, 20477390],
[136.38, 23459920],
[131.73, 11886130],
[134.82, 25365750],
[132.43, 41888940],
[131.55, 44051860],
[139.53, 37139590],
[143.85, 29803280],
[144.22, 22019830],
[142.16, 15062230],
[141.55, 18387680],
[144.96, 17305480],
[147.87, 24061590],
[151.53, 21740210],
[149.94, 16302120],
[148.68, 15894150],
[150.35, 24479290],
[151.75, 25435380],
[151.79, 59983970],
[146.22, 45351650],
[142.09, 31270990],
[145.37, 31235150],
[150.95, 22000170],
[146.04, 27574300],
[154.39, 19066360],
[154.78, 15381630],
[154.05, 19636460],
[154.92, 21123820],
[159.42, 17307030],
[158.78, 18711620],
[153.52, 15194060],
[153.74, 25209770],
[153.35, 35225150],
[151.38, 30143210],
[157.9, 18494270],
[157.25, 23825100],
[157.33, 25727470],
[158.85, 25707300],
[162.43, 23086120],
[159.33, 35303190],
[162.44, 26260420],
[164.46, 33786480],
[168.84, 27192570],
[166.95, 24271500],
[164.91, 27430470],
[165.41, 18907320],
[162.93, 45847680],
[166.02, 18812060],
[163.06, 19568020],
[160.3, 22331470],
[160.58, 20951950],
[162.32, 21682850],
[161.36, 25376900],
[162, 24033850],
[165.94, 20285090],
[164.18, 19896190],
[163.04, 24151910],
[162.53, 41418330],
[167.18, 31191210],
[171.16, 29460630],
[175.73, 18025110],
[177.64, 24105390],
[175.9, 18357780],
[176.26, 15720690],
[177.46, 17853600],
[174.645, 14519920],
[172.9, 17945260],
[173.64, 16760320],
[172.62, 19475690],
[172.5, 21449120],
[173.8, 24819470],
[174.7, 31161240],
[179.53, 32658240],
[181.11, 18961200],
[180.05, 17349150],
[180.26, 21467940],
[183.09, 19652850],
[185.18, 22178460],
[183.81, 33127670],
[185.69, 49600350],
[177.78, 24730780],
[176.37, 32235750],
[171.65, 33979910],
[172.58, 40213830],
[171.06, 65129810],
[174.89, 59700640],
[176.26, 169059900],
[217.5, 45279590],
[214.67, 28318380],
[210.91, 15933870],
[209.94, 16152700],
[208.09, 11186170],
[209.36, 15322340],
[209.99, 15239470],
[207.23, 10866950],
[207.32, 11421420],
[206.92, 15439760],
[202.54, 12729340],
[203.54, 12868530],
[204.74, 18133700],
[203.23, 19687900],
[198.45, 19582000],
[192.73, 13489510],
[197.36, 13735130],
[194.32, 15516540],
[196.23, 18153600],
[195.84, 18697530],
[199, 17869610],
[196.35, 25170720],
[201.74, 17050440],
[201.5, 18906350],
[202, 28175590],
[197.49, 19968690],
[198.31, 16470990],
[195.85, 21833150],
[196.81, 19096760],
[192.41, 15121450],
[192.4, 11217070],
[191.54, 12885730],
[189.1, 12503130],
[188.18, 21451790],
[191.34, 22500160],
[192.94, 15059480],
[193.28, 18881330],
[193.99, 17278520],
[191.78, 30727790],
];

const max_pri = data.reduce((p, v) =>  p > v[0] ? p : v[0] );
const max_vol = data.reduce((p, v) =>  p > v[1] ? p : v[1] );
const min_pri = data.reduce((p, v) =>  p < v[0] ? p : v[0] );
const min_vol = data.reduce((p, v) =>  p < v[1] ? p : v[1] );
const pri_range = max_pri - min_pri;
const vol_range = max_vol - min_vol;

function scaleUp(step) { // denormalize
    return [
        step[0] * pri_range + min_pri,
        step[1] * vol_range + min_vol,
    ];
}


module.exports = {
    data:data.reverse(),
    scaleup: scaleUp,
    scaledown: function(step) { // normalize
        return [
            (step[0] - min_pri) / pri_range,
            (step[1] - min_vol) / vol_range,
        ];
    },
    getPrice: function(step) {
        return Math.round(scaleUp(step)[0]);
    }
};