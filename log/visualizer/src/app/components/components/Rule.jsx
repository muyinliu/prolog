var React = require('react');
var Classable = require('../../mixins/classable.js');
var tweenState = require('react-tween-state');
var ReactTransitionGroup = React.addons.TransitionGroup;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var cx = React.addons.classSet;

var Rule = React.createClass({
  mixins: [Classable, tweenState.Mixin],

  getInitialState: function() {
    return {width: 0};
  },

  propTypes: {
    parent: React.PropTypes.object.isRequired,
    node: React.PropTypes.object.isRequired,
    // count: React.PropTypes.number.isRequired,
    shouldAnimate: React.PropTypes.bool.isRequired,
  },

  getDefaultProps: function() {
    return {
      shouldAnimate: false
    };
  },

  componentDidMount: function() {
    this.shouldAnimate = this.props.shouldAnimate;
  },

  // animation
  componentWillEnter: function(done) {
    this.animatedStarted = true;

    if (!this.actualWidth) {
      this.actualWidth = parseFloat(window.getComputedStyle(this.getDOMNode()).width);
    }
    var duration = 250;
    this.tweenState('width', {
      easing: tweenState.easingTypes.easeOutSine,
      duration: duration,
      endValue: this.actualWidth,
    });
    this.lastTimeoutIDEnter = window.setTimeout(function() {
      done();
    }.bind(this), duration*1.5);
  },

  componentWillLeave: function(done) {
    this.animatedStarted = true;

    var targetWidth = 0;
    var duration = 250;
    this.tweenState('width', {
      easing: tweenState.easingTypes.easeOutSine,
      duration: duration,
      endValue: targetWidth,
    });
    this.lastTimeoutIDLeave = window.setTimeout(function() {
      done();
    }.bind(this), duration*1.5);
  },

  // TODO: performance optimization
  // shouldComponentUpdate: function(nextProps, nextState) {}

  render: function() {
    var style = {
    };

    // if ( this.props.shouldAnimate && this.animatedStarted) {
    //   var width = this.getTweeningValue('width');
    //   style.width = width;
    //   // console.log("width: "+style.width +" actualWidth: "+parseFloat(window.getComputedStyle(this.getDOMNode()).width));
    // }

    var parent = this.props.parent;
    var env = this.props.node;
    var childNodes = this.props.children;
    var trace = this.props.trace;


    // label
    var displayString = env.goals.toString();

    if (env.goals.length === 0 && env.solution) {
      displayString = env.solution.toString();
    }

    if (Array.isArray(env.goals) && env.goals.length === 1 && env.goals[0] === "nothing") {
      displayString = "✕";
    }

    // use this to display information inside the current node
    // renamed rule, rewritten goal
    if (trace) {

      var msg = "";
      if (trace.currentRule) {
        msg += trace.currentRule.toString() + " -- Renamed rule\n";
      }

      if (trace.goal && trace.goal.toString().length !== 0) {
        // msg += trace.goal.toString();
        displayString = trace.goal.toString();
      }
      if (trace.subst) {
        displayString += " -> "+trace.subst.toString();
      }

      if (trace.solution) {
        displayString += trace.solution;
      }

      if (trace.status) {
        switch(trace.status) {
          case "BEFORE":
            break;
          case "SUBST":
            displayString += " -- Subsituting";
            break;
          case "NEW_GOAL":
            // if (trace.goal.toString().length > 0) {
            //   displayString += " -- New goal";
            // } else {
            //   displayString += " -- Found a solution";
            // }
            break;
          case "SUCCESS":
            // displayString += " -- Unification Succeeded";
            break;
          case "FAILURE":
            // displayString += " -- Unification Failed";
            break;
          default:
        }

      }


    }
    var lineWidget = msg ? <div className="errorMsg">{msg}</div> : undefined;


    // rule label
    var rules = env.rules;
    console.log(env);

    var ruleLabels =
    <div className="ruleLabels">{rules.map(function(rule, i) {

      var highlight = false;
      if (trace && trace.currentRule && rule === trace.currentRule.toString()) {
        highlight = true;
      }

      var ruleLabelClasses = cx({
        'ruleLabel': true,
        'highlight': highlight
      });
      return <div className="labelChild"><div className={ruleLabelClasses}>{rule.toString()}</div>{childNodes[i]}</div>;

    })}</div>;

    // label
    var labelClasses = cx({
      'label': true,
    });
    var labelProps = {
      // onMouseEnter: parent.onMouseOverPExpr.bind(parent, node),
      // onMouseLeave: parent.onMouseOutPExpr,
      // onClick: parent.onClickPExpr.bind(parent, node),
    };
    var label = <div key={"label"} className={labelClasses} {...labelProps}>{displayString}</div>;

    // children
    // var children =
    //   <div key={"children"} className="children">
    //     {<div className="childrenCSSTransitionGroup" component="div">
    //                                       {childNodes}
    //                                     </div>}
    //   </div>;

      // {<ReactTransitionGroup className="childrenCSSTransitionGroup" component="div">
      //                                   {childNodes}
      //                                 </ReactTransitionGroup>}

    // rule
    var nothing = false;
    if (Array.isArray(env.goals) && env.goals.length === 1 && env.goals[0] === "nothing") {
      nothing = true;
    }

    var ruleClasses = cx({
      'rule': true,
      'nothing': nothing
    });
    var ruleProps = {
      env: env,
    };

    // {ruleLabel}
    //            {children}

    return <div key={env.envId} style={style} className={ruleClasses} {...ruleProps}>
            {label}
            {ruleLabels}
          </div>;

  }
});

module.exports = Rule;
