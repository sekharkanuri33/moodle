<?php
 
// Every file should have GPL and copyright in the header - we skip it in tutorials but you should not skip it for real.
 
// This line protects the file from being accessed by a URL directly.                                                               
defined('MOODLE_INTERNAL') || die();
 
// We will add callbacks here as we add features to our theme.

function shorten_coursename($coursename){
    $courseShortNameExplode = explode('_', $coursename);
    $coursename='';
    foreach($courseShortNameExplode as $shortNameItem) {  
        if($shortNameItem==$courseShortNameExplode[0]){
            $coursename .= substr($shortNameItem, 0, 4).' '.substr($shortNameItem, 4, 7);
        } else if($shortNameItem==$courseShortNameExplode[1]) {
            $coursename .= '-'.$shortNameItem;
        }
    }
    return $coursename;
}

function custom_flatnav(){
    global $PAGE;

    $navNodes = $PAGE->flatnav;
    $courseHome= 'coursehome';
    $classify = array(
        COURSE_TIMELINE_FUTURE => 'Future Courses',
        COURSE_TIMELINE_INPROGRESS => 'Current Courses',
        COURSE_TIMELINE_PAST => 'Past Courses'
    );
    
    $toolsIsFirst = true;
    if (enrol_user_sees_own_courses()) {
        $toolsIsFirst = false;
    }
    $tools = createAndAddNavigationNode($navNodes, 'home', 'Tools', null, navigation_node::TYPE_ROOTNODE, 'tools', !$toolsIsFirst);

    $toRemove = array('home','myhome','mycourses');
    $firstSectionKey = '';
    foreach ($navNodes as $node) {
        if (in_array ($node->key , $toRemove) || $node->type == navigation_node::TYPE_COURSE) {
            $navNodes->remove($node->key, $node->type);
        } else if ($node->key === $courseHome) {
            $node->text = 'Course Home';
        }

        if (inCourseContext()) {
            if ($node->type === navigation_node::TYPE_SECTION && $firstSectionKey === '') {
                $firstSectionKey = $node->key;
            }
        }
    }
    
    if (inCourseContext()) {
        $coursecontent = createAndAddNavigationNode($navNodes, $firstSectionKey, 'Course Content', null, navigation_node::TYPE_ROOTNODE, 'coursecontent', true);
        $courseinformation = createAndAddNavigationNode($navNodes, $courseHome, 'Course Information', null, navigation_node::TYPE_ROOTNODE, 'courseinformation', true);
    } else {
        if (enrol_user_sees_own_courses()) {
            $firstCourseClassification = true;
            foreach (getCoursesArrayByTimelineClassification() as $classification => $courses) {
                $coursesNode = createAndAddNavigationNode($navNodes, 'tools', $classify[$classification], null, navigation_node::TYPE_CONTAINER, $classification, true);
                $coursesNode->add_class('courses-node');
                $coursesNode->add_class($classification);

                if (!empty($courses)) {
                    foreach ($courses as $course) {
                        if ($courseNode = addCourse($navNodes, 'tools', $course)) {
                            $courseNode->add_class($classification);
                            $courseNode->add_class('course-node');
                        }
                    }
                } else {
                    $nocourses = createAndAddNavigationNode($navNodes, 'tools', 'No Courses', null, navigation_node::TYPE_ROOTNODE, 'no-' . $classification . '-courses');
                    $courseNode->add_class($classification);
                    $courseNode->add_class('no-course-node');
                }

                if($firstCourseClassification) {
                    $firstCourseClassification = false;
                }
            }
        }
    }

	return $navNodes;
}

function addCourse($destination, $beforeKey, $course) {
    global $CFG, $SITE;

    $coursecontext = context_course::instance($course->id);

    if ($course->id != $SITE->id && !$course->visible) {
        if (is_role_switched($course->id)) {
            // user has to be able to access course in order to switch, let's skip the visibility test here
        } else if (!has_capability('moodle/course:viewhiddencourses', $coursecontext)) {
            return false;
        }
    }

    $issite = ($course->id == $SITE->id);
    $shortname = format_string($course->shortname, true, array('context' => $coursecontext));
    $fullname = format_string($course->fullname, true, array('context' => $coursecontext));
    // This is the name that will be shown for the course.
    $coursename = empty($CFG->navshowfullcoursenames) ? $shortname : $fullname;
    $url = new moodle_url('/course/view.php', array('id'=>$course->id));
    return createAndAddNavigationNode($destination, $beforeKey, shorten_coursename($coursename), $url, navigation_node::TYPE_COURSE, $course->id);;
}

function getCoursesArrayByTimelineClassification() {
    global $CFG;
    
    $sortorder = 'visible DESC';
    // Prevent undefined $CFG->navsortmycoursessort errors.
    if (empty($CFG->navsortmycoursessort)) {
        $CFG->navsortmycoursessort = 'sortorder';
    }

    $sortorder = $sortorder . ',' . $CFG->navsortmycoursessort . ' ASC';
    $courses = enrol_get_my_courses('*', $sortorder);
    $navcourses = [];

    foreach ($courses as $course) {
        $classify = course_classify_for_timeline($course);
        $navcourses[$classify][] = $course;
    }

    return $navcourses;
}

function createAndAddNavigationNode($destination, $beforeKey, $text, $url, $type, $key, $withDivider=false) {
    $node = createFlatNavigationNode($text, $url, $type, $key, $withDivider);
    $destination->add($node, $beforeKey);
    return $node;
}

function createFlatNavigationNode($text, $url, $type, $key, $withDivider=false) {
    $node = new flat_navigation_node(navigation_node::create($text, $url, $type, null, $key), 0);
    $node->set_showdivider($withDivider);
    return $node;
}

function inCourseContext() {
	global $PAGE;
    return in_array ($PAGE->context->contextlevel, array(CONTEXT_COURSE, CONTEXT_MODULE));
}