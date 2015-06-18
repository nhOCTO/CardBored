var api, needLogin = false;

(function (window, document, undefined) {
    var ahref = 'https://canvas.cityu.edu.hk/api/v1/';
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
                url: l,
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        self: function(){
            return $.ajax({
                url: ahref + 'users/self',
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        login: function(uid){
            return $.ajax({
                url: ahref + 'users/'+uid+'/logins',
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        activity: function(uid){
            return $.ajax({
                url: ahref + 'users/self/activity_stream',
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        courses: function(){
            return $.ajax({
                url: ahref + 'courses',
                method: 'POST',
                data: {access_token: pwd, 'include[]': 'syllabus_body' }
            });
        },
        frontpage: function(course_id){
            return $.ajax({
                url: ahref + 'courses/'+course_id+'/front_page',
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        tabs: function(course_id){
            return $.ajax({
                url: ahref + 'courses/'+course_id+'/tabs',
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        notification: function(acc_id, uid){
            return $.ajax({
                url: ahref + 'accounts/'+acc_id+'/users/'+uid+'/account_notifications',
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        announcement: function(course_id){
            return $.ajax({
                url: ahref + 'courses/'+course_id+'/discussion_topics?only_announcements=true',
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        discussion: function(course_id){
            return $.ajax({
                url: ahref + 'courses/'+course_id+'/discussion_topics',
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        entry: function(course_id, discuss_id){
            return $.ajax({
                url: ahref + 'courses/'+course_id+'/discussion_topics/'+discuss_id+'/entries',
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        reply: function(course_id, discuss_id, entry_id){
            return $.ajax({
                url: ahref + 'courses/'+course_id+'/discussion_topics/'+discuss_id+'/entries/'+entry_id+'/replies',
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        assignment: function(course_id){
            return $.ajax({
                url: ahref + 'courses/'+course_id+'/assignments',
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        submission: function(course_id, ass_id, user_id){
            return $.ajax({
                url: ahref + 'courses/'+course_id+'/assignments/'+ass_id+'/submissions/'+user_id,
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        page: function(course_id, page_url){
            return $.ajax({
                url: ahref + 'courses/'+course_id+'/pages'+(page_url?'/'+page_url:''),
                method: 'POST',
                data: {access_token: pwd}
            });
        },
        course_folders: function(course_id){
            return $.ajax({
                url: ahref + 'courses/'+course_id+'/folders',
                method: 'POST',
                data: {access_token: pwd, per_page: 100}
            });
        },
        files: function(folder_id){
            return $.ajax({
                url: ahref + 'folders/'+folder_id+'/files',
                method: 'POST',
                data: {access_token: pwd, per_page: 100}
            });
        }
    };
})(window, document);