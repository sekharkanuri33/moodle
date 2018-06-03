define(['jquery', 'theme_liberty/moment', 'theme_liberty/jquery.scrollbar', 'theme_liberty/gh', 'theme_liberty/gauge', 'theme_liberty/easyXDM', 'theme_liberty/json2'], function($, moment, scrollbar, lu, Gauge) {
    return {
        init: function() {
        	templateTrigger=true;
			var dateFormatting;
			// jquery scrollbar
			/*$('.topics').each(function(){
				if($(this).find('.instancename') && $(this).find('.instancename').html().indexOf('Announcements') != -1){
					$(this).remove();
				}
			});*/

			$('body').addClass('g-lu-responsive');
			$(window).scroll(function(e){
				positionHeader();
			});
			positionHeader();

			function positionHeader(){
				var windowScroll = $(window).scrollTop();
				var topPosition = 45-windowScroll;
				var navPosition = 125-windowScroll;
				if(topPosition < 0){
					topPosition = 0;
					navPosition = 80;
				} else if (topPosition > 45){
					topPosition = 45;
					navPosition = 125;
				}
				$('.navbar').css('top', topPosition+'px');
				$('html').css('margin-top', topPosition+'px');
				$('#nav-drawer').css('top', navPosition+'px');
			}

			$('.activity-count').each(function(){
				if($(this).html().indexOf('0 /')==-1){
					$(this).addClass('green');
			    }
			});

			$('.generaltable td').each(function(){
				if($(this).html()=='-'){
					$(this).html('');
			    }
			});
			$('.progress-doughnut').each(function(){
				if($(this).find('.progress-text').html() == '100%'){
					$(this).addClass('completed');
			    }
			});
			moment.updateLocale('en', {
			    meridiem : {
			        am : 'a.m.',
			        AM : 'A.M.',
			        pm : 'p.m.',
			        PM : 'P.M.'
			    }
			});

			if($('.discussiontoggle').length > 0){
				$('.discussiontoggle').click(function(){
					setTimeout(function(){window.location.reload();},500);
					return true;
				});
			}

			//  Possible Gauge functionality. Working but incomplete at the moment.
			/*if($('.progressPercentage').length > 0){
				var progressPercentage = $('.progressPercentage').html().split(' ')[1].split('%')[0];
				$('.progressPercentage').after('<canvas id="progress">'+progressPercentage+'</canvas>');
				var opts = {
				  angle: 0.50, // The span of the gauge arc
				  lineWidth: 0.1, // The line thickness
				  radiusScale: 1, // Relative radius
				  pointer: {
				    color: '#000000' // Fill color
				  },
				  limitMax: false,     // If false, max value increases automatically if value > maxValue
				  limitMin: false,     // If true, the min value of the gauge will be fixed
				  colorStart: '#2773CB',   // Colors
				  colorStop: '#2773CB',    // just experiment with them
				  strokeColor: '#EEEEEE',  // to see which ones work best for you
				  highDpiSupport: true     // High resolution support
				};
				var target = document.getElementById('progress'); // your canvas element
				var gauge = new Gauge.Donut(target).setOptions(opts); // create sexy gauge!
				gauge.maxValue = 100; // set max gauge value
				gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
				gauge.animationSpeed = 25; // set animation speed (32 is default value)
				gauge.set(progressPercentage); // set actual value
			}*/

			/*if($('.summary').length > 0){
				$('.summary').each(function(){
					if($(this).html()==''){
						$(this).remove();
					}
				});
			}*/

			if($('.course-content .content .summary').length > 0){
				$('.course-content .content .summary').each(function(){
					if($(this).html()==''){
						$(this).addClass('empty');
					}
				});
			}

			/* Course Selection */
			if($('.course-selector').length > 0){
				if($('.course-node.past').length == 0){
					$('.course-list [data-courses="past"]').hide();
				}
				if($('.course-node.inprogress').length == 0){
					$('.course-list [data-courses="inprogress"]').hide();
				}
				if($('.course-node.future').length == 0){
					$('.course-list [data-courses="future"]').hide();
				}
				$('.course-selector').click(function(){
					$('.course-list').stop(true, false).slideToggle();
					$('.course-selector').toggleClass('active');
				});
				$('.course-list li').click(function(){
					$('.course-selector').removeClass('active');
					$('.courses-node').hide();
					$('.course-list li').removeClass('active');
					$('.courses-node.'+$(this).attr('data-courses')).show();
					$(this).addClass('active');
					$('.selected-course').html($(this).html());
					$('.course-list').stop(true, false).slideUp();
				});
			}

			/* Course completion progress indicator */
			if($('.progressBarCell').length > 0){
				if(getURLParameterVal('section')){
					var completedAssignments = $('.activity .actions .auto-y, .activity .actions .manual-y, .activity .actions .auto-y, .activity .actions .auto-pass, .activity .actions .auto-fail, [name="completionstate"][value="0"]').length;
					var totalAssignments = $('.activity .actions').length;
					var weekPercent = (completedAssignments/totalAssignments*100).toFixed(0);
					if(totalAssignments==0){
						$('[data-block="completion_progress"]').addClass('noprogress');
						$('[data-block="completion_progress"] .content').html('No Completion Progress');
					} else {
						$('[data-block="completion_progress"] .content').html('\
							<div class="week-completion">\
								<span class="week-percent">\
									<span class="number">0<span>%</span></span>\
									<svg class="progress-circle" viewBox="0 0 300 300" shape-rendering="geometricPrecision">\
									  <defs>\
									   <mask id="circle_mask" x="0" y="0" width="300" height="300" maskUnits="userSpaceOnUse">\
									      <circle cx="150" cy="150" r="153" stroke-width="0" fill="black" opacity="1"></circle>\
									      <circle cx="150" cy="150" r="150" stroke-width="0" fill="white" opacity="1"></circle>\
									      <circle class="progress-radial-mask-inner" cx="150" cy="150" r="110" stroke-width="0" fill="black" opacity="1"></circle>\
									    </mask>\
									  </defs>\
									  <g mask="url(#circle_mask)">\
									    <circle class="progress-circle-track" cx="150" cy="150" r="150" stroke-width="0" opacity="1"></circle>\
									    <path class="progress-radial-bar" transform="translate(150, 150)" d="">\
									    </path>\
									  </g>\
									</svg>\
								</span>\
								<span class="completed-assignments">\
									<span class="number">'+completedAssignments+'</span>step'+((completedAssignments==1)?'':'s')+' complete\
								</span>\
								<span class="remaining-assignments">\
									<span class="number">'+(totalAssignments-completedAssignments)+'</span>step'+((totalAssignments-completedAssignments)==1?'':'s')+' left\
								</span>\
							</div>');
						$('[data-block="completion_progress"] .card-text').addClass('loaded');
						$('[data-block="completion_progress"] .card-text').show();

						var drawProgress = function(percent){
						  if(isNaN(percent)) {
						    return;
						  }
						  percent = parseFloat(percent);
						  // Alot of the code below is inspired by a project I came across
						  // online. I've saddly lost a reference to it. Do you know where
						  // this might have come from?
						  var bar = document.getElementsByClassName ('progress-radial-bar')[0]
						  , α = percent * 360
						  , π = Math.PI
						  , t = 90
						  , w = 153;
						  if(α >= 360) {
						    α = 359.999;
						  }
						  var r = ( α * π / 180 )
						  , x = Math.sin( r ) * w
						  , y = Math.cos( r ) * - w
						  , mid = ( α > 180 ) ? 1 : 0 
						  , animBar = 'M 0 0 v -%@ A %@ %@ 1 '.replace(/%@/gi, w)
						  + mid + ' 1 '
						  + x + ' '
						  + y + ' z';
						  bar.setAttribute( 'd', animBar );
						};

						var max = weekPercent/100;
						var progress = 0;
						drawProgress(progress);

						if(max > 0){
							var progressInterval = window.setInterval(function () {
								progress = progress + 0.01;
								if(progress >= max) {
									window.clearInterval(progressInterval);
								}
								drawProgress(progress);
						  		// Set Progress Percentage
						  		$('.week-percent .number').html(parseInt(progress * 100) + "<span>%</span>");
							}, 20);
						} else {
					  		$('.week-percent .number').html("0<span>%</span>");
						}
					}
				} else {
					var completionProgress = parseInt(($('.progressBarCell[style*="73A839"]').length/$('.progressBarCell').length)*100);
					$('[data-block="completion_progress"]').find('.content').html('<span class="progress-upper"></span><span class="total-course-progress">0<span>%</span></span><span class="progress-lower"></span>');
					$('[data-block="completion_progress"] .card-text').addClass('loaded');
					$('[data-block="completion_progress"] .card-text').show();
					console.log(completionProgress);
					var progress=0;
					var progressInterval = window.setInterval(function () {
						progress++;
						if(progress >= completionProgress) {
							window.clearInterval(progressInterval);
						}
					  	// Set Progress Percentage
						$('[data-block="completion_progress"] .total-course-progress').html(parseInt(progress)+'<span>%</span>');
					}, 50);
					// $('[data-block="completion_progress"]').find('.content').html('<span class="progress-upper"></span><span class="total-course-progress">'+$('.progressPercentage').html().split(' ')[1].split('%')[0]+'<span>%</span></span><span class="progress-lower"></span>');
					// $('[data-block="completion_progress"] .card-text').show();
				}
			}

			if($('.links').length > 0){
				$('.links').each(function(){
					if($(this).html().indexOf('...')!=-1){
						$(this).html($(this).html().replace(/\.\.\./g, ''));
					}
				});
			}

			/* Remove elipses from sidebar buttons */
			if($('aside .card-text').length > 0){
				$('aside .card-text').each(function(){
					if($(this).html().indexOf('...')!=-1){
						$(this).html($(this).html().replace(/\.\.\./g, ''));
					}
				});
			}

			/* Quizzes */
			if($('#quiz-time-left').length > 0){
				var timerElem = $('#quiz-time-left')[0].outerHTML;
				var timerContent = $('#quiz-time-left')[0].innerHTML;
				if(timerContent && timerContent!=''){
					$('#quiz-timer').remove();
					$('.block-region').prepend('<aside class="block card m-b-1"><div class="card-block"><h3 class="card-title">Time Remaining</h3><div class="card-text content"><div id="quiz-timer" role="timer">'+timerElem+'</div></div></div></aside>');
					$('#quiz-timer').css('opacity','1').css('position','static').show();
				}
			}

			// sets quiz navigation to be sticky on the right, just uncomment to use :)
			/*if($('#page-mod-quiz-attempt [data-region="blocks-column"]').length > 0){
				var quizNavPos = $('[data-region="blocks-column"]')[0].getBoundingClientRect().top;
				console.log(quizNavPos);
				$(window).scroll(function(e){
					var windowScroll = $(window).scrollTop()+100;
					if(windowScroll >= quizNavPos){
						$('#page-mod-quiz-attempt [data-region="blocks-column"]').addClass('sticky');
					} else {
						$('#page-mod-quiz-attempt [data-region="blocks-column"]').removeClass('sticky');
					}
					if($('#quiz-timer').length > 0){
						$('#page-mod-quiz-attempt [data-region="blocks-column"]').addClass('hastimer');
					}
				});
			}*/

			if($('.que').length > 0){
				if(M.mod_quiz&&M.mod_quiz.autosave){
					M.mod_quiz.autosave.delay = 2000;
					M.mod_quiz.autosave.save_done = function(t,n){
						// console.log(t);
						// $('.que .info').after('<div class="saved">Saved</div>');
						// $('.que .info').
					}
				}
				$('.que .answer input').on('change', function(){
					$(this).closest('.que').addClass('answered');
					$(this).closest('.que').find('.state').html('Answered');
					var qid = $(this).closest('.que').attr('id').replace('q', '');
					$('#quiznavbutton'+qid).addClass('answered');
					// restart save timeout
					M.mod_quiz.autosave.start_save_timer();
				});
			}

			$('.togglecompletion').on('submit', function(){
				if($(this).find('[name="completionstate"]').val()==1){
					$('.progressBarCell[ontouchstart*=",'+$(this).find('[name="id"]').val()+');"]').attr('style', 'background-color:#73A839');
				} else {
					$('.progressBarCell[ontouchstart*=",'+$(this).find('[name="id"]').val()+');"]').attr('style', 'background-color:#C71C22');
				}
			});


			/* Dashboard */
			if($('body').hasClass('path-my')){
				formatDashboardDates();
				$('[data-action="view-more"]').click(function(){
					formatDashboardDates();
				});
				$('[data-toggle="tab"]').click(function(){
					formatDashboardDates();
				});
				function formatDashboardDates() {
					dateFormatting = setInterval(function(){
						if($('[data-region="event-list-group-container"] .list-group .course-date').length > 0){
							$('[data-region="event-list-group-container"]').each(function(){
								if($(this).find('h5').hasClass('text-danger')){
									$(this).find('.list-group .course-date').addClass('text-danger');
								}
							});
							$('[data-region="event-list-group-container"] .list-group .course-date').each(function(){
								var currHTML = $(this).html().replace(/\s+/g, ' ');
								if(moment(currHTML).format('MMM D') != 'Invalid date'){
									$(this).attr('data-due', moment(currHTML).format('YYYY-MM-DD HH:mm:ss'));
									$(this).attr('data-due-text', currHTML);
									$(this).html('Due on <span>'+moment(currHTML).format('MMM D')+' at <span>'+moment(currHTML).format('h:mm a')+'</span></span>');
									// clearTimeout(dateFormatting);
								}
							});
						}
						if($('[data-region="event-list-group-container"] .list-group .course-name').length > 0){
							$('[data-region="event-list-group-container"] .course-name').each(function(){
								$(this).html($(this).html().split(':')[0]);
							});
						}
					}, 500);
				}
			}

			if($('.minicalendar').length > 0){
				$('.minicalendar th.header abbr').each(function(){
					$(this).html($(this).html().substring(0,1));
				});
			}

			if($('.maincalendar').length > 0){
				$('.maincalendar td').each(function(){
					if($(this).find('li').length>2){
						$(this).append('<span class="loadmorecalendar"><span class="more">'+($(this).find('li').length-2)+' more...</span><span class="less">less</span></span>');
						$(this).find('.loadmorecalendar').click(function(){
							$(this).closest('td').toggleClass('showall');
						});
					}
				});
			}

			// $('[data-region="send-message-txt"]').on('keydown', function(e){
			// 	if(e.keyCode == 13){
			// 		$(this).closest('.message-box').find('[data-action="send-message"]').trigger('click');
			// 		return false;
			//     }
			// });


			/*
				Begin Global Header
			*/
			function getUrlVars() {
			    var vars = {};
			    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
			        vars[key] = value;
			    });
			    return vars;
			}

			function setCookie(cname, cvalue, exdays) {
			    var d = new Date();
			    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
			    var expires = "expires=" + d.toUTCString();
			    document.cookie = cname + "=" + cvalue + "; " + expires;
			}

			function getCookie(cname) {
			    var name = cname + "=";
			    var ca = document.cookie.split(';');
			    for (var i = 0; i < ca.length; i++) {
			        var c = ca[i];
			        while (c.charAt(0) == ' ') c = c.substring(1);
			        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
			    }
			    return "";
			}
			// if (getUrlVars()["acode"]) {
			//     ghAcode = getUrlVars()["acode"];
			//     setCookie('ACODE', ghAcode, 30)
			// } else
			if (document.cookie.indexOf('ACODE') >= 0) {
			    ghAcode = getCookie('ACODE')
			} else {
			    ghAcode = "C20522"
			}
			if ((ghAcode.charAt(0) === 'D') || (ghAcode.charAt(0) === 'd')) {
			    ghCid = 1
			} else {
			    ghCid = 2
			}
			var subdomain = 'www';
		    var myluSubdomain = 'mylu';
			// $('head').append('<link rel="stylesheet" href="https://' + subdomain + '.liberty.edu/wwwadmin/globals/globalheader/min/gh.min.css" media="all" charset="utf-8" />');
			var ghbar = '<div id="lu-gh" class="lu-gh-container"><div id="lu-gh-bar"><ul id="lu-gh-links"><li id="lu-gh-official"';
			if (window.location.hostname.indexOf(subdomain + ".liberty.edu") <= -1) ghbar += ' class="lu-gh-official-sub"';
			ghbar += '><a href="//' + subdomain + '.liberty.edu/">Liberty University</a></li>';
			if (window.location.hostname.indexOf(subdomain + ".liberty.edu") <= -1 || window.location.hostname.indexOf(subdomain + ".liberty.edu/online") >= 0 || window.location.hostname.indexOf(subdomain + ".liberty.edu/athletics") >= 0 || window.location.hostname.indexOf(subdomain + ".liberty.edu/alumni") >= 0) ghbar += '<li><a href="//' + subdomain + '.liberty.edu/">Liberty.edu</a></li>';
			ghbar += '<li><a href="//' + subdomain + '.liberty.edu/online/">Online</a></li><li><a href="//' + subdomain + '.liberty.edu/athletics/">Athletics</a></li><li><a href="//' + subdomain + '.liberty.edu/alumni/">Alumni</a></li><li><a href="javascript:;" data-href="more" id="lu-gh-more" class="lu-gh-control">More</a></li></ul><ul id="lu-gh-user"><li><a id="cta-requestinfo-gh" class="cta-requestinfo" href="//' + subdomain + '.liberty.edu/requestinfo/">Request Info</a></li><li><a id="cta-applynow-gh" class="cta-applynow" href="https://apply.liberty.edu/?c=' + ghCid + '&acode=' + ghAcode + '">Apply Now</a></li><li><a href="https://' + subdomain + '.liberty.edu/secure/" id="lu-gh-login">Sign In</a></li></ul></div><a href="https://' + subdomain + '.liberty.edu/secure/?redirect=//' + window.location.hostname + '" id="lu-gh-login-mobile">Sign In</a><a id="lu-gh-mobile-apps-toggle" href="#">Apps</a><div id="lu-gh-content"></div></div>';
			$('body').append(ghbar);
        	// lu.gh.activateBar();

			function getURLParameterVal(name) {
			  return decodeURIComponent((new RegExp('[?|&]' + name.toLowerCase() + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search.toLowerCase()) || [null, ''])[1].replace(/\+/g, '%20')) || null;
			}
        }
    }
});