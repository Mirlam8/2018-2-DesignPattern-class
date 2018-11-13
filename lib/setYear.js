// 출시날짜를 받으면 연도별로 분류해 주는 소스
//1970s_Befor / 1980s / 1990s / 2000~05 / 2006~10 / 2006~10 / 2016~Now
// 받는 정보 형식  0000/00/00
module.exports = {
    get_yearDir:function(date){
        var year = parseInt(String(date).substring(0,4));
        if(year < 1980){
            return `1970s_Before`
        }
        else if(year < 1990){
            return `1980s`
        }
        else if(year < 2000){
            return  `1990s`
        }
        else if(year < 2006){
            return  `2000~05`
        }
        else if(year < 2011){
            return  `2006~10`
        }
        else if(year < 2016){
            return  `2011~15`
        }
        else{
            return  `2016~Now`
        }
    }
    
}
//변수이름.get_yearDir