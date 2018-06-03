<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Course renderer.
 *
 * @package    theme_noanme
 * @copyright  2016 Frédéric Massart - FMCorz.net
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace theme_liberty\output;
defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/mod/quiz/renderer.php');
require_once($CFG->dirroot . '/mod/quiz/attemptlib.php');

use moodle_url;
use single_button;
use confirm_action;

/**
 * Course renderer class.
 *
 * @package    theme_noanme
 * @copyright  2016 Frédéric Massart - FMCorz.net
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class mod_quiz_renderer extends \mod_quiz_renderer {

    public function view_information($quiz, $cm, $context, $messages) {
        global $CFG;

        $output = '';

        // Print quiz name and description.
        $output .= $this->heading(format_string($quiz->name));
        $output .= $this->quiz_intro($quiz, $cm);

        // Show number of attempts summary to those who can view reports.
        if (has_capability('mod/quiz:viewreports', $context)) {
            if ($strattemptnum = $this->quiz_attempt_summary_link_to_reports($quiz, $cm,
                    $context)) {
                $output .= \html_writer::tag('div', $strattemptnum,
                        array('class' => 'quizattemptcounts'));
            }
        }
        return $output;
    }

    public function view_page($course, $quiz, $cm, $context, $viewobj) {
        $output = '';
        $output .= $this->view_information($quiz, $cm, $context, $viewobj->infomessages);
        if($viewobj->infomessages){
            $output .= $this->box($this->access_messages($viewobj->infomessages), 'quizinfo');
        }
        // $output .= $this->view_table($quiz, $context, $viewobj);
        $output .= '<div class="quizactionbox">';
        $output .= $this->box($this->view_page_buttons($viewobj), 'quizattempt');
        $output .= '</div>';
        $output .= $this->view_result_info($quiz, $context, $cm, $viewobj);
        return $output;
    }

    public function countdown_timer(\quiz_attempt $attemptobj, $timenow) {

        $timeleft = $attemptobj->get_time_left_display($timenow);
        if ($timeleft !== false) {
            $ispreview = $attemptobj->is_preview();
            $timerstartvalue = $timeleft;
            if (!$ispreview) {
                // Make sure the timer starts just above zero. If $timeleft was <= 0, then
                // this will just have the effect of causing the quiz to be submitted immediately.
                $timerstartvalue = max($timerstartvalue, 1);
            }
            $this->initialise_timer($timerstartvalue, $ispreview);
        }

        return \html_writer::tag('div', get_string('timeleft', 'quiz') . ' ' .
                \html_writer::tag('span', '', array('id' => 'quiz-time-left')),
                array('id' => 'quiz-timer', 'role' => 'timer',
                    'aria-atomic' => 'true', 'aria-relevant' => 'text'));
    }
}