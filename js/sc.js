(function (window, document, undefined) {
    
    var _courses, 
        _currSections,
        _uid, _account_id,
        _$main;

    var _currCourse,  // string = cid
        _currCourseObj,  // course obj
        _currTabElement,
        _currAnns,
        _currAsgs;

    var $spinner2x = $('<img width="32px" height="32px" src="img/ajax-loader.gif"/>'),
        $spinner1x = $('<img width="14px" height="14px" src="img/ajax-loader.gif"/>'),
        $waitBlock = $('<div id="wait-block"></div>'),
        $msgBlock = $('<div id="msg-block"></div>');
    
    var builders = {
        courseTag: function(item) {
            return $('<div class="course-tag" id="'+item.id+'"><i class="fa fa-book"></i>'+
                     '<span>'+item.name.split(' ')[0]+'</span></div>');
        },
        toolbarItem: function (icon, label) {
            var $item = $('<div class="toolbar-item" id="'+label+'"><i class="fa fa-'+icon+'"></i><span>'+label+'</span></div>');
            return $item;
        },
        reply: function (item) {
            return $('<div class="ann-reply">' +
               '<span class="ann-author"><i class="fa fa-user"></i><span>  '+item.user_name+'</span></span>'+
               '<span class="ann-date"> '+item.created_at.replace('T', ' ').slice(0, -1)+'</span>'+
               '<div class="ann-main" id="'+item.user_id+'">'+
               '<div class="ann-detail">'+item.message+'</div>'+
               '</div></div>');
        }
    };
    
    var load = {
        home: function(wait){
            _$main.empty();
            $('#toolbar').empty();
            if (wait) utils.showWait();
            // request notifications & sctivities
            $.when(api.notification(_account_id, _uid), api.activity()).done(function(n, a){
                // noti
                _$main.append('<h2>Notifications</h2>');
                for (var i in n[0]) {
                    var noti = n[0][i];
                    var $noti = $('<div class="noti-item"><h3><i class="fa fa-'+(noti.icon=='warning'?'exclamation-triangle':'info-circle')+'"></i>  '+noti.subject+
                                  '</h3><p>'+noti.message+'</p></div>');
                    _$main.append($noti);
                }
                // acti
                 _$main.append('<h2>Recent Activities</h2>');
                for (var i in a[0]) {
                    var acti = a[0][i];
                    var $acti = $('<div class="noti-item"><h3><i class="fa fa-calendar-o"></i>  '+acti.title+'</h3><p>'+noti.message+'</p></div>');
                    _$main.append($acti);
                }
                if (wait) utils.hideWait();
                $spinner1x.remove();
            }).fail(utils.fail);
        },
        tabs: function(cid){
            $.when(api.tabs(cid)).done(function(t){
                $('#toolbar').empty();
                for (var i in t) {
                    if (t[i].id == 'home') {
                        var $item = builders.toolbarItem('home', 'home');
                        $item.click(function(){load.frontpage(_currCourse);});
                        $('#toolbar').append($item);
                    } else if (t[i].id == 'announcements') {
                        var $item = builders.toolbarItem('bell-o', 'announcements');
                        $item.click(function(){load.announcement(_currCourse, false);});
                        $('#toolbar').append($item);
                    } else if (t[i].id == 'assignments') {
                        var $item = builders.toolbarItem('edit', 'assignments');
                        $item.click(function(){load.assignment(_currCourse);});
                        $('#toolbar').append($item);
                    } else if (t[i].id == 'discussions') {
                        var $item = builders.toolbarItem('comment-o', 'discussions');
                        $item.click(function(){load.announcement(_currCourse, true);});
                        $('#toolbar').append($item);
                    } else if (t[i].id == 'pages') {
                        var $item = builders.toolbarItem('file-text-o', 'pages');
                        $item.click(function(){load.pages(_currCourse);});
                        $('#toolbar').append($item);
                    } else if (t[i].id == 'files') {
                        var $item = builders.toolbarItem('folder-open-o', 'files');
                        $item.click(function(){load.file_frame(_currCourse);});
                        $('#toolbar').append($item);
                    } else if (t[i].id == 'syllabus') {
                        var $item = builders.toolbarItem('list-ol', 'syllabus');
                        $item.click(function(){load.syllabus(_currCourse);});
                        $('#toolbar').append($item);
                    } else if (t[i].id == 'collaborations') {
                        var $item = builders.toolbarItem('globe', 'collaborations');
                        $item.click(function(){load.announcement(_currCourse);});
                        $('#toolbar').append($item);
                    }
                }
                // force add home
                if ($('#home').length == 0) {
                    var $item = builders.toolbarItem('home', 'home');
                        $item.click(function(){load.frontpage(_currCourse);});
                        $('#toolbar').prepend($item);
                }
                load.frontpage(_currCourse); 
            });
        },
        frontpage: function(cid){
            utils.showWait();
            $.when(api.frontpage(cid)).done(function(p){
                _$main.empty();
                _$main.html(p.body);
                $('#title').text(_currCourseObj.name);
                utils.tabChange('home');
                utils.hideWait();
                $spinner1x.remove();
            }).fail(utils.failFrontPage);
        },
        announcement: function(cid, discussion, isMore, link){
            utils.showWait();
            // whether load more page
            var request;
            if (isMore)
                request = api.link(link);
            else
                request = discussion ? api.discussion(cid) : api.announcement(cid);
            // ajax
            $.when(request).done(function(a, textStatus, jqXHR){
                var linkHeader = utils.parseLinkHeader(jqXHR.getResponseHeader('Link'));
                if (!isMore) _$main.empty();
                _currAnns  = _currAnns ? _currAnns.concat(a) : a;
                for (var i in a) {
                    var ann = a[i];
                    var $annItem = $('<div class="ann-item"></div>'),
                        $annAuthor = $('<span class="ann-author"><i class="fa fa-user"></i><span>  '+ann.user_name+'</span></span>'),
                        $annDate = $('<span class="ann-date"> ('+ann.posted_at.replace(/[TZ]/i,' ').slice(0,-1)+')</span>'),
                        $annMain = $('<div class="ann-main anime-box" id="'+ann.id+'"><span class="ann-title">'+ann.title+'</span></div>'),
                        $annDetail = $('<div class="ann-detail"></div>'),
                        $annRead = $('<span class="ann-'+(ann.ead_state=='unread'?'un':'')+'read">'+
                                     '<i class="fa fa-'+(ann.ead_state=='unread'?'exclamation':'check')+'"></i>'+
                                     '<span>'+(ann.ead_state=='unread'?'un':'')+'read</span></span>'),
                        $annMsg = $(ann.message);
                    // new ann-item
                    $annDetail.text($annMsg.text());
                    $annMain.append($annRead, $annDetail);
                    $annItem.append($annAuthor, $annDate, $annMain);
                    $annMain.click(function(e){
                        var $this = $(this);
                        var $detail = $(this).find('.ann-detail');
                        var msg = $(utils.find(parseInt($(this).attr('id')), _currAnns).message);
                        if ($detail.css('white-space') == 'nowrap') {
                            // folded
                            $detail.css('white-space', 'normal');
                            $detail.html(msg);
                            if (_currTabElement.attr('id') == 'discussions') {
                                utils.showWait();
                                // load entry
                                $.when(api.entry(cid, this.id)).done(function(e){
                                    if (e.length <= 0) {
                                        utils.hideWait();
                                        return;
                                    }
                                    var entry = e[0];
                                    $this.append(builders.reply(entry));
                                    // load reply
                                    $.when(api.reply(cid, $this.attr('id'), entry.id)).done(function(r){
                                        for (var i in r) {
                                            $this.append(builders.reply(r[i]));
                                        }
                                        utils.hideWait();
                                    }).fail(utils.fail);
                                }).fail(utils.fail);
                            }
                        } else {
                            // opened 
                            $this.find('.ann-reply').remove();
                            $detail.css('white-space', 'nowrap');
                            $detail.html($(msg).text());
                        }
                    });
                    _$main.append($annItem);
                }
                if (!isMore) utils.tabChange(discussion ? 'discussions' : 'announcements');
                // since tabChange unbind the scroll event
                $(window).scroll(function(){
                    if($(window).scrollTop() + $(window).height() > $(document).height() - 70) {
                        if (linkHeader && linkHeader['next'])
                            load.announcement(cid, discussion, true, linkHeader['next']['href']);
                        $(window).off('scroll');
                    }
                });
                utils.hideWait();
            }).fail(utils.fail);
        },
        assignment: function(cid){
            utils.showWait();
            $.when(api.assignment(cid)).done(function(a){
                _$main.empty();
                _currAsgs = a;
                for (var i in a) {
                    var asg = a[i];
                    var $asgDesp = $(asg.description);
                    var $asgItem = $('<div class="asg-item anime-box" id="'+asg.id+'">'+
                                     '<i class="fa fa-file-text-o"></i>'+
                                     '<span class="asg-title">'+asg.name+'</span>'+
                                     '<span class="asg-due">'+
                                     (asg.due_at ? '<b>Due</b>: '+asg.due_at.replace('T', ' ').slice(0, -4) : 'Undated') +
                                     '</span>'+
                                     '<div class="asg-detail">'+$asgDesp.text()+'</div></div>'),
                        $asgTable = $('<table class="asg-table"><tbody><tr>'+
                                      (asg.has_submitted_submissions ? '<td class="asg-sub"><i class="fa fa-check"></i><span>SUBMITTED</span></td>' : 
                                                                       '<td class="asg-unsub"><i class="fa fa-exclamation"></i><span>UNSUBMITTED</span></td>')+
                                      '<td class="asg-lock">'+(asg.locked_for_user?'<i class="fa fa-lock"></i><span>LOCKED</span>':'')+'</td>'+
                                      //'<td class="asg-grade">8/8</td>'+
                                      '</tr></tbody></table>');
                    $asgItem.append($asgTable);
                    $asgItem.click(function(){
                        var $this = $(this);
                        var $detail = $(this).find('.asg-detail');
                        var clickedAsg = utils.find(parseInt($(this).attr('id')), _currAsgs);
                        var msg = $(clickedAsg.description);
                        if ($detail.css('white-space') == 'nowrap') {
                            // folded
                            $detail.css('white-space', 'normal');
                            $detail.html(msg);
                            if (clickedAsg.has_submitted_submissions) {
                                utils.showWait();
                                $.when(api.submission(cid, this.id, _uid)).done(function(s){
                                    var $subDetail = $('<tr class="asg-sub-detail">'+
                                                        '<td><span>Submitted at '+s.submitted_at.replace('T',' ').slice(0,-1)+'</span>  | <i class="fa fa-download"></i><a class="link" href="'+clickedAsg.submissions_download_url+'">DOWNLOAD</a></td>'+
                                                        '<td class="asg-grade"><b>'+(clickedAsg.grading_type=='letter_grade'?s.grade:'')+'</b><span>'+(s.score?s.score:'Not yet graded')+'/'+clickedAsg.points_possible+'</span></td></tr>');
                                    $this.find('tbody').append($subDetail);
                                    utils.hideWait();
                                }).fail(utils.fail);
                            }
                        } else {
                            // opened 
                            $this.find('.asg-sub-detail').remove();
                            $detail.css('white-space', 'nowrap');
                            $detail.html($(msg).text());
                        }
                    });
                    _$main.append($asgItem);
                }
                utils.tabChange('assignments');
                utils.hideWait();
            }).fail(utils.fail);      
        },
        pages: function(cid){
            utils.showWait();
            $.when(api.page(cid, false)).done(function(p){
                _$main.empty();
                for (var i in p) {
                    var page = p[i];
                    var $page = $('<div id="'+page.url+'" class="page-item anime-box">'+page.title+'</div>');
                    $page.click(function(){
                        var $this = $(this);
                        if (!$this.hasClass('opened')) {
                            utils.showWait();
                            $.when(api.page(cid, this.id)).done(function(sp){
                                var $pageBody = $('<div class="page-body">'+sp.body+'</div>');
                                $this.append($pageBody);
                                $this.addClass('opened');
                                utils.hideWait();
                            }).fail(utils.fail);
                        } else {
                            $this.find('.page-body').remove();
                            $this.removeClass('opened');
                        }
                    });
                    _$main.append($page);
                }
                utils.tabChange('pages');
                utils.hideWait();                        
            }).fail(utils.fail);
        },
        file_frame: function(cid) {
            utils.showWait();
            _$main.empty();
            _$main.append($('<div id="file-frame"><div id="file-left"><ul></ul></div><div id="file-right"><table><thead><tr><th>Name</th><th>Size</th><th>Updated</th><th>Locked</th></tr></thead><tbody></tbody></table></div></div>'));
            $('#file-frame').height($('#detail-div').height()-80);
            var $folderBox = $('#file-left ul'),
                $fileBox = $('#file-right tbody');
            $.when(api.course_folders(cid)).done(function(f){
                var showed = [];  // e.g. {'1234': true}
                for (var i in f) {
                    showed[f[i].id] = false;
                }
                // find a folder item by id
                function findFolder (id) {
                    for (var ii in f)
                        if (id == f[ii].id) return f[ii];
                }
                // add a folder to the folder frame
                function showFolder (folder) {
                    if (!showed[folder.id]) {
                        // get parent
                        var parent = findFolder(folder.parent_folder_id);
                        // if parent not showed, show parent first
                        if (parent && !showed[parent.id] && parent.parent_folder_id) {
                            showFolder (parent);
                        }
                        var $parent = parent ? $('#li-'+parent.id+'>ul') : $folderBox;
                        $parent.append($('<li id="li-'+folder.id+'"><i class="fa fa-folder-open-o"></i>  <span class="folder-name" id="'+folder.id+'">'+folder.name+'</span><ul></ul></li>'));
                        showed[folder.id] = true;
                    }
                }
                for (var i in f) {
                    var thisFile = f[i];
                    showFolder(thisFile);
                }
                // parse file size
                function parseSize (size) {
                    if (size > 1000000)
                        return (size/1000000).toFixed(2) + 'M';
                    else if (size > 1000)
                        return (size/1000).toFixed(2) + 'K';
                    else 
                        return size + 'B';
                }
                // click
                $('.folder-name').click(function(){
                    var $this = $(this);
                    $this.append($spinner1x);
                    $('.folder-name').removeClass('folder-active');
                    $fileBox.empty();
                    $.when(api.files(this.id)).done(function(files){
                        for (var i in files) {
                            var file = files[i];
                            var contentType = file["content-type"].replace(/\./g, '_');
                            var $file = $('<tr><td><i class="fa fa-file-'+(fileTypes[contentType]?fileTypes[contentType]:'')+'o"></i>'+
                                           '  <a href="'+file.url+'">'+file.display_name+'</a></td>'+
                                           '<td>'+parseSize(file.size)+'</td>'+
                                           '<td>'+file.updated_at.replace('T',' ').slice(0,-1)+'</td>'+
                                           '<td>'+(file.locked_for_user?'Locked':'-')+'</td></tr>');
                            $fileBox.append($file);
                        }
                        $this.addClass('folder-active');
                        $spinner1x.remove();
                    }).fail(utils.fail);
                });
                utils.tabChange('files');
                utils.hideWait();
            }).fail(utils.fail);
        },
        syllabus: function(){
            _$main.empty();
            _$main.append($(_currCourseObj.syllabus_body));
            utils.tabChange('syllabus');
        }
    };
    
    var utils = {
        find: function(id, data) {
            for (var i in data)
                if (data[i].id == id)
                    return data[i];
        },
        fail: function(jqXHR, textStatus, errorThrown){
            utils.hideWait();
            utils.showMsg(jqXHR.status + ' ' + errorThrown);
            $spinner1x.remove();
        },
        failFrontPage: function(jqXHR, textStatus, errorThrown){
            utils.hideWait();
            if (jqXHR.status == 404) {
                _$main.empty();
                var $alert = ('<div class="frontpage-alert"><br/><br/><br/><br/>This course does not have a front page</div>');
                _$main.append($alert);
                utils.tabChange('home');
            } else {
                utils.showMsg(jqXHR.status + ' ' + errorThrown);
            }
            $spinner1x.remove();
        },
        tabChange: function(newTabName) {
            $(window).off('scroll');
            var $newTab = $('#'+newTabName);
            $newTab.addClass('toolbar-item-active');
            if (_currTabElement) _currTabElement.removeClass('toolbar-item-active');
            _currTabElement = $newTab;
        },
        showWait: function() {
            $waitBlock.append($spinner2x);
            $('body').append($waitBlock);
        },
        hideWait: function(f) {
            $spinner2x.remove(); 
            $waitBlock.remove();
            if (f) f.call();
        },
        showMsg: function(str) {
            $msgBlock.text(str);
            $msgBlock.fadeIn().delay(500).fadeOut();
        },
        parseLinkHeader: function (header) {
            if (!header) return;
            function unquote (value) {
                if (value.charAt(0) == '"' && value.charAt(value.length - 1) == '"') 
                    return value.substring(1, value.length - 1); 
                return value; 
            }
            var linkexp = /< [^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g; 
            var paramexp = /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g; 
            var matches = header.split(','); 
            var rels = new Object(); 
            for (i = 0; i < matches.length; i++) { 
                var split = matches[i].split('>'); 
                var href = split[0].substring(1); 
                var ps = split[1]; 
                var link = new Object(); 
                link.href = href; 
                var s = ps.match(paramexp); 
                for (j = 0; j < s.length; j++) { 
                    var p = s[j]; 
                    var paramsplit = p.split('='); 
                    var name = paramsplit[0]; 
                    link[name] = unquote(paramsplit[1]); 
                } 
                if (link.rel != undefined)
                    rels[link.rel] = link;
            }
            return rels; 
        }
    };
    
    var settings = {
        about: function() {
            var $about = $('<div><h2>Better Canvas</h2><p>v 0.1</p>'+
                              '<p>by lhc <br/>( <a href="mailto:lhc199652@gmail.com">lhc199652@gmail.com</a> )</p></div>');
            settings.showAlertBox($about, true);
        },
        login: function(callback){
            var $login = $('<div><h2>Please enter your access token</h2>'+
                           '<p>Better Canvas cannot fetch your information. It may caused by : <br/>A) You do not have an access token, <br/>B) Your access token has expired, <br/>C) Your access token is not correct. <br/>Please enter a valid access token below:'+
                           '<p>由于现在各项功能尚未完备，你不需要输入你的邮箱密码，而是你的一个「Access Token」。Access Token 很容易获得，<a href="readme/access_token.html">点击这里查看如何获得 Access Token</a></p>'+
                           '<input type="text" id="input-access"></input></p></div>'),
                $okBtn = $('<div id="alert-close-btn">OK</div>');
            $okBtn.click(function(){
                api.setPwd($login.find('#input-access').val());
                utils.showWait();
                $.when(api.self()).done(function(){
                    utils.hideWait();
                    if (callback) callback.call();
                }).fail(function(){
                    utils.hideWait();
                    settings.login();
                });
            });
            settings.showAlertBox($login, false, $okBtn);
        },
        changeUser : function(){
            var $login = $('<div><h2>Change user</h2>'+
                           '<p>Please enter another access token below:'+
                           '<input type="text" id="input-access"></input></p></div>'),
                $okBtn = $('<div id="alert-close-btn">OK</div>');
            $okBtn.click(function(){
                var newPw = $login.find('#input-access').val();
                if (newPw.length>10) {
                    api.setPwd(newPw);
                    window.location.reload();
                }
            });
            settings.showAlertBox($login, false, $okBtn);
        },
        changeBg : function(){
            var $changeBg = $('<div><h2>Change background</h2><p>Please enter background image URL:</p>'+
                              '<input type="text" id="input-bg"></input></p></div></div>'),
                 $okBtn = $('<div id="alert-close-btn">OK</div>');
            $okBtn.click(function(){
                var url = $changeBg.find('#input-bg').val();
                if (url.length>0) {
                    $('body').css('background-image', 'url('+url+')');
                    localStorage.bgImgURL = url;
                }
            });
            settings.showAlertBox($changeBg, false, $okBtn);
        },
        showAlertBox: function($content, defaultCloseBtn, $customBtn){
            var $alertBox = $('<div class="alert-box"></div>').hide(),
                $bodyMask = $('<div style="position:fixed;top:0;width:100%;background-color:rgba(0,0,0,.8);"></div>').hide();
            $alertBox.append($content);
            // btn
            if (defaultCloseBtn)
                 $btn = $('<div id="alert-close-btn">CLOSE</div>');
            else 
                $btn = $customBtn;
            $btn.click(function(){
                $alertBox.remove(); $bodyMask.remove();
            });
            $alertBox.append($btn);
                
             $('body').append($bodyMask).append($alertBox);
            $bodyMask.height($(window).height());
            $alertBox.offset({
                top: $(window).height()/2-$alertBox.height()/2,
                left: $(window).width()/2-$alertBox.width()/2,
            })
            $bodyMask.fadeIn(200);
            $alertBox.show();
        }
    };
    
    $(document).ready(function(){
        // set appearance
        $('#wrapper, #courses-div, #detail-div').css('min-height', $(window).height()-130);
        $('#detail-div').css('margin-left', $('#courses-div').width()+'px');
        if (!localStorage.bgImgURL || localStorage.bgImgURL == 'undefined')
            localStorage.bgImgURL= 'img/b.jpg';
        $('body').css('background-image', 'url('+localStorage.bgImgURL+')');
        
        
        //set listener
        $('#about').click(settings.about);
        $('#change-user').click(settings.changeUser);
        $('#change-bg').click(settings.changeBg);
        
        _$main = $('#main');
        
        // msg block
        $msgBlock.hide();
        $('body').append($msgBlock);
        $waitBlock.offset({
            top: $(window).height()/2 - 66,
            left: $(window).width()/2 - 96
        });
        $msgBlock.offset({
            top: $(window).height()/2 - 66,
            left: $(window).width()/2 - 96
        });
        
        // login
        if (needLogin) 
            settings.login(init);
        else init();
        
        // init
        function init() {
            utils.showWait();

            // request self
            $.when(api.self()).done(function(u){
                _uid = u.id;
                $('#avatar-img').attr('src', u.avatar_url);
                $.when(api.login(_uid)).done(function(l){
                    _account_id = l.account_id;
                });
            }).fail(function(jqXHR, textStatus, errorThrown){
                if (jqXHR.status == '401') {
                    settings.login(init);
                    return;
                } else {
                    utils.fail(jqXHR, textStatus, errorThrown);
                }
            });

            // request courses
            $.when(api.courses()).done(function(c){
                _courses = c.sort(function(a,b){return(a.name<b.name?1:-1)});
                // home tag
                var $home = $('<div class="course-tag course-tag-active" id="-1"><i class="fa fa-home"></i><span>Home</span></div>');
                $home.click(function(e){
                    $spinner1x.remove();
                    $(this).append($spinner1x);
                    _$main.empty();
                    $('#'+_currCourse).removeClass('course-tag-active');
                    _currCourse = parseInt($(this).attr('id'));
                    $('#'+_currCourse).addClass('course-tag-active');
                    _currCourseObj = utils.find(_currCourse, _courses);
                    load.home(true);
                });
                $('#courses-div').append($home);
                // course tags
                for (var i in _courses) {
                    var $tag = builders.courseTag(_courses[i]);
                    $tag.click(function(e){
                        $spinner1x.remove();
                        $(this).append($spinner1x);
                        _$main.empty();
                        $('#'+_currCourse).removeClass('course-tag-active');
                        _currCourse = parseInt($(this).attr('id'));
                        $('#'+_currCourse).addClass('course-tag-active');
                        _currCourseObj = utils.find(_currCourse, _courses);
                        // tabs
                        load.tabs(_currCourse);
                    });
                    $('#courses-div').append($tag);
                }
                _currCourse = -1;

                utils.hideWait();
            }).fail(function(jqXHR, textStatus, errorThrown){
                //alert(errorThrown);
            });

            load.home(false);
        }
    });
})(window, document);