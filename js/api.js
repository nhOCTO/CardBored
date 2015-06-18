var api, needLogin = false;

(function (window, document, undefined) {
    //var ahref = 'https://canvas.cityu.edu.hk/api/v1/';
    //var ahref = 'http://localhost/~admin/test/index.php'
    var ahref = 'php/index.php'
    var pwd = '1839~YOmpTKlPYL4pmcIpn1SwF5p84LPLevBkeLpCUfUpLBzJEl38h293DLFgfzsudueE';
    //pwd = '1839~njr2Agp51FQdzQjk3w8PZC47rpNklqbwcIxizoeGYg84nfeXMWCIZQVW3gkNUg2W';
    if (localStorage && localStorage.pwd && localStorage.pwd != 'undefined') 
        pwd = localStorage.pwd;
    else
        needLogin = true;
        
    api = {
        setPwd: function(newPwd){
            pwd = newPwd;
            localStorage.pwd = newPwd;
        },
        link: function(l){
            return $.ajax({
                url: ahref + '?type=url',
                method: 'GET',
                headers: {'Access-token': pwd, 'Url-for-url-type': l}
            });
        },
        self: function(){
            return $.ajax({
                url: ahref + '?type=self',
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        login: function(uid){
            return $.ajax({
                url: ahref + '?type=login&uid='+uid,
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        activity: function(uid){
            return $.ajax({
                url: ahref + '?type=activity',
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        courses: function(){
            return $.ajax({
                url: ahref + '?type=courses',
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        frontpage: function(course_id){
            return $.ajax({
                url: ahref + '?type=frontpage&cid=' + course_id,
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        tabs: function(course_id){
            return $.ajax({
                url: ahref + '?type=tabs&cid=' + course_id,
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        notification: function(acc_id, uid){
            return $.ajax({
                url: ahref + '?type=notification&acc_id='+acc_id+'&uid='+uid,
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        announcement: function(course_id){
            return $.ajax({
                url: ahref + '?type=announcement&cid='+course_id,
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        discussion: function(course_id){
            return $.ajax({
                url: ahref + '?type=discussion&cid='+course_id,
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        entry: function(course_id, discuss_id){
            return $.ajax({
                url: ahref + '?type=entry&cid=' + course_id + '&discuss_id=' + discuss_id,
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        reply: function(course_id, discuss_id, entry_id){
            return $.ajax({
                url: ahref + '?type=reply&cid='+course_id+'&discuss_id='+discuss_id+'/&entry_id=/'+entry_id,
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        assignment: function(course_id){
            return $.ajax({
                url: ahref + '?type=assignment&cid=' +course_id,
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        submission: function(course_id, ass_id, user_id){
            return $.ajax({
                url: ahref + '?type=submission&cid='+course_id+'&ass_id='+ass_id+'&uid='+user_id,
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        page: function(course_id, page_url){
            return $.ajax({
                url: ahref + '?type=page&cid='+course_id+'&single_page='+(page_url?'true':'false') + (page_url?'&page_url='+page_url:''),
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        course_folders: function(course_id){
            return $.ajax({
                url: ahref + '?type=folders&cid='+course_id,
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        },
        files: function(folder_id){
            return $.ajax({
                url: ahref + '?type=files&folder_id='+folder_id,
                method: 'GET',
                headers: {'Access-token': pwd}
            });
        }
    };
})(window, document);