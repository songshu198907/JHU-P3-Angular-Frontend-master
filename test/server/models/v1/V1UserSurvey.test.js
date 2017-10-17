  var assert = require('assert');
var adapter = require('sails-memory');
var _ = require('lodash');


describe('V1UserSurvey Model', function() {

  afterEach(function() {
    V1UserSurvey.destroy();
  });

  beforeEach(function() {
    // Drop existing collections

      adapter.drop('memory', 'clinic_block_randomizer', [], function() {})

      adapter.drop('memory', 'clinician_codes', [], function() {})

      adapter.drop('memory', 'educations', [], function() {})

      adapter.drop('memory', 'healthcare_provider_contents', [], function() {})

      adapter.drop('memory', 'job_audit_logging', [], function() {})

      adapter.drop('memory', 'question_categories', [], function() {})

      adapter.drop('memory', 'question_codes', [], function() {})

      adapter.drop('memory', 'question_types', [], function() {})

      adapter.drop('memory', 'races', [], function() {})

      adapter.drop('memory', 'search_audit_logging', [], function() {})

      adapter.drop('memory', 'SendGrid', [], function() {})

      adapter.drop('memory', 'settings', [], function() {})

      adapter.drop('memory', 'surveys', [], function() {})

      adapter.drop('memory', 'survey_answers', [], function() {})

      adapter.drop('memory', 'survey_questions', [], function() {})

      adapter.drop('memory', 'survey_question_skip_logic', [], function() {})

      adapter.drop('memory', 'topics', [], function() {})

      adapter.drop('memory', 'Twilio', [], function() {})

      adapter.drop('memory', 'users', [], function() {})

      adapter.drop('memory', 'user_audit_logging', [], function() {})

      adapter.drop('memory', 'user_surveys', [], function() {})

      adapter.drop('memory', 'user_survey_answers', [], function() {})

      adapter.drop('memory', 'vaccination_reminders', [], function() {})

      adapter.drop('memory', 'videos', [], function() {})

      adapter.drop('memory', 'video_audit_logging', [], function() {})

    // Recreate collections

      adapter.define('memory', 'clinic_block_randomizer', V1ClinicianBlockRandomizer.attributes, function() {})

      adapter.define('memory', 'clinician_codes', V1ClinicianCode.attributes, function() {})

      adapter.define('memory', 'educations', V1Education.attributes, function() {})

      adapter.define('memory', 'healthcare_provider_contents', V1HealthcareProviderContent.attributes, function() {})

      adapter.define('memory', 'job_audit_logging', V1JobAuditLogging.attributes, function() {})

      adapter.define('memory', 'question_categories', V1QuestionCategory.attributes, function() {})

      adapter.define('memory', 'question_codes', V1QuestionCode.attributes, function() {})

      adapter.define('memory', 'question_types', V1QuestionType.attributes, function() {})

      adapter.define('memory', 'races', V1Race.attributes, function() {})

      adapter.define('memory', 'search_audit_logging', V1SearchAuditLogging.attributes, function() {})

      adapter.define('memory', 'SendGrid', V1SendGrid.attributes, function() {})

      adapter.define('memory', 'settings', V1Setting.attributes, function() {})

      adapter.define('memory', 'surveys', V1Survey.attributes, function() {})

      adapter.define('memory', 'survey_answers', V1SurveyAnswer.attributes, function() {})

      adapter.define('memory', 'survey_questions', V1SurveyQuestion.attributes, function() {})

      adapter.define('memory', 'survey_question_skip_logic', V1SurveyQuestionSkipLogic.attributes, function() {})

      adapter.define('memory', 'topics', V1Topic.attributes, function() {})

      adapter.define('memory', 'Twilio', V1Twilio.attributes, function() {})

      adapter.define('memory', 'users', V1User.attributes, function() {})

      adapter.define('memory', 'user_audit_logging', V1UserAuditLogging.attributes, function() {})

      adapter.define('memory', 'user_surveys', V1UserSurvey.attributes, function() {})

      adapter.define('memory', 'user_survey_answers', V1UserSurveyAnswer.attributes, function() {})

      adapter.define('memory', 'vaccination_reminders', V1VaccinationReminder.attributes, function() {})

      adapter.define('memory', 'videos', V1Video.attributes, function() {})

      adapter.define('memory', 'video_audit_logging', V1VideoAuditLogging.attributes, function() {})

  });

  it('should successfully create an instance of V1UserSurvey', function(done) {
    var beforeCount;

    V1UserSurvey.count()
      .then(function(count) {
        beforeCount = count;
        return V1UserSurvey.create({"completedAt":"Disputant miniaturization","completition":2081,"createdAt":"2009-11-28 23:54:50 +0000","currentuseranswers":[1,2,3],"firstQuestion":{"one":1,"two":2,"three":3},"firstQuestionId":91817,"firstReminder":false,"isComplete":false,"matchedVideos":[1,2,3],"maternalVideoComplete":false,"maternalVideoNumber":32377,"maternalVideoPosition":54638.8901516974,"pediatricVideoComplete":false,"pediatricVideoNumber":40961,"pediatricVideoPosition":94354.21649109886,"questionCount":83657,"secondReminder":true,"surveyId":20021,"userId":88915,"videoSourceVersion":"Earnestine twinkle"});
      })
      .then(function(obj) {
        assert(obj, 'Failed to create object.');
        return V1UserSurvey.count();
      })
      .then(function(count) {
        assert(count > beforeCount, 'Expected create to increase object count.');
        done();
      })
      .catch(function (exception) {
        done(exception);
      });
  });

  it('should successfully read an instance of V1UserSurvey', function(done) {

    var attributes = {"completedAt":"Lithography sepsis","completition":55493,"createdAt":"2014-07-22 17:05:42 +0000","currentuseranswers":[1,2,3],"firstQuestion":{"one":1,"two":2,"three":3},"firstQuestionId":54358,"firstReminder":true,"isComplete":false,"matchedVideos":[1,2,3],"maternalVideoComplete":true,"maternalVideoNumber":13237,"maternalVideoPosition":57338.840393804705,"pediatricVideoComplete":false,"pediatricVideoNumber":93115,"pediatricVideoPosition":77622.79445653393,"questionCount":90381,"secondReminder":true,"surveyId":46258,"userId":20972,"videoSourceVersion":"Marseillaise understatement"};
    var id;

    if (attributes && Object.keys(attributes).length !== 0) {
      V1UserSurvey.findOne(attributes)
        .then(function(record) {
          assert(!record, 'Should not have found a record.');
          return V1UserSurvey.create(attributes);
        })
        .then(function(obj) {
          assert(obj, 'Failed to create object.');
          id = obj.id;
          return V1UserSurvey.findOne({'id':obj.id});
        })
        .then(function(obj) {
          assert(obj, 'Expected to find a model with id ' + id + '.');
          done();
        })
        .catch(function (exception) {
          done(exception);
        });
      } else {
        done();
      }
  });

  it('should successfully update an instance of V1UserSurvey', function(done) {
    var attributes = {"completedAt":"Superpower physiotherapist","completition":16950,"createdAt":"2008-11-11 09:32:18 +0000","currentuseranswers":[1,2,3],"firstQuestion":{"one":1,"two":2,"three":3},"firstQuestionId":87065,"firstReminder":true,"isComplete":false,"matchedVideos":[1,2,3],"maternalVideoComplete":true,"maternalVideoNumber":60617,"maternalVideoPosition":78529.17015607428,"pediatricVideoComplete":true,"pediatricVideoNumber":68930,"pediatricVideoPosition":40016.16905542373,"questionCount":57513,"secondReminder":true,"surveyId":20570,"userId":89285,"videoSourceVersion":"Undemonstrative perseveres"};
    var updatedObject;

    V1UserSurvey.create(attributes)
      .then(function(obj) {
        assert(obj, 'Failed to create object.');
        var attributes = {"completedAt":"Disqualifies polymer","completition":85327,"createdAt":"1999-06-04 01:39:05 +0000","currentuseranswers":[1,2,3],"firstQuestion":{"one":1,"two":2,"three":3},"firstQuestionId":30407,"firstReminder":true,"isComplete":true,"matchedVideos":[1,2,3],"maternalVideoComplete":false,"maternalVideoNumber":92901,"maternalVideoPosition":86199.94970952897,"pediatricVideoComplete":false,"pediatricVideoNumber":32559,"pediatricVideoPosition":48872.982366757366,"questionCount":3375,"secondReminder":false,"surveyId":10003,"userId":91409,"videoSourceVersion":"Transportation Procter"};
        return V1UserSurvey.update(obj.id, attributes);
      })
      .then(function(collection) {
        updatedObject = collection[0];
        assert(updatedObject, 'Failed to update object.');
        return V1UserSurvey.findOne({'id':updatedObject.id});
      })
      .then(function(obj) {
        assert(obj.id === updatedObject.id, 'Expected to find the instance just created.');
        done();
      })
      .catch(function (exception) {
        done(exception);
      });
  });

  it('should successfully destroy an instance of V1UserSurvey', function(done) {

    var attributes = {"completedAt":"Formalism tribunes","completition":39027,"createdAt":"1994-07-04 00:02:38 +0000","currentuseranswers":[1,2,3],"firstQuestion":{"one":1,"two":2,"three":3},"firstQuestionId":32871,"firstReminder":false,"isComplete":false,"matchedVideos":[1,2,3],"maternalVideoComplete":true,"maternalVideoNumber":18996,"maternalVideoPosition":25918.27282141341,"pediatricVideoComplete":false,"pediatricVideoNumber":80103,"pediatricVideoPosition":85235.85145454443,"questionCount":65838,"secondReminder":true,"surveyId":73088,"userId":16129,"videoSourceVersion":"Unhesitatingly plenipotentiary"};

    if (attributes && Object.keys(attributes).length !== 0) {
      V1UserSurvey.findOne(attributes)
        .then(function(record) {
          assert(!record, 'Should not have found a record.');
          return V1UserSurvey.create(attributes);
        })
        .then(function(obj) {
          assert(obj, 'Failed to create object.');
          return V1UserSurvey.destroy(obj.id);
        })
        .then(function(collection) {
          assert(collection.length === 1, 'Expected to destroy the instance just created.');
          done();
        })
        .catch(function (exception) {
          done(exception);
        });
      } else{
          done();
      }
  });



  it('should have the correct transientAttributes', function() {
    assert(V1UserSurvey.transientAttributes.indexOf('completition') !== -1);
  });

  it('should have a getter', function() {
    assert(V1UserSurvey.attributes['getCompletition']);
  });



  it('should have the correct transientAttributes', function() {
    assert(V1UserSurvey.transientAttributes.indexOf('currentuseranswers') !== -1);
  });

  it('should have a getter', function() {
    assert(V1UserSurvey.attributes['getCurrentuseranswers']);
  });



  it('should have the correct transientAttributes', function() {
    assert(V1UserSurvey.transientAttributes.indexOf('firstQuestion') !== -1);
  });

  it('should have a getter', function() {
    assert(V1UserSurvey.attributes['getFirstQuestion']);
  });



  it('should have the correct transientAttributes', function() {
    assert(V1UserSurvey.transientAttributes.indexOf('matchedVideos') !== -1);
  });

  it('should have a getter', function() {
    assert(V1UserSurvey.attributes['getMatchedVideos']);
  });





  describe('custom callbacks', function() {
    it('should have a callbacks object', function() {
      assert(V1UserSurvey.callbacks, 'V1UserSurvey is missing the callbacks object');
    });




      it('should contain "beforeCreate" callback', function() {
        assert(V1UserSurvey.callbacks['beforeCreate'], 'beforeCreate is missing.');
      });

      it('"beforeCreate" callback should be a function', function() {
      assert(_.isFunction(V1UserSurvey.callbacks['beforeCreate']), 'beforeCreate should be a function.');
    });



      it('should contain "afterCreate" callback', function() {
        assert(V1UserSurvey.callbacks['afterCreate'], 'afterCreate is missing.');
      });

      it('"afterCreate" callback should be a function', function() {
      assert(_.isFunction(V1UserSurvey.callbacks['afterCreate']), 'afterCreate should be a function.');
    });



      it('should contain "beforeFind" callback', function() {
        assert(V1UserSurvey.callbacks['beforeFind'], 'beforeFind is missing.');
      });

      it('"beforeFind" callback should be a function', function() {
      assert(_.isFunction(V1UserSurvey.callbacks['beforeFind']), 'beforeFind should be a function.');
    });



      it('should contain "afterFind" callback', function() {
        assert(V1UserSurvey.callbacks['afterFind'], 'afterFind is missing.');
      });

      it('"afterFind" callback should be a function', function() {
      assert(_.isFunction(V1UserSurvey.callbacks['afterFind']), 'afterFind should be a function.');
    });



      it('should contain "beforeUpdate" callback', function() {
        assert(V1UserSurvey.callbacks['beforeUpdate'], 'beforeUpdate is missing.');
      });

      it('"beforeUpdate" callback should be a function', function() {
      assert(_.isFunction(V1UserSurvey.callbacks['beforeUpdate']), 'beforeUpdate should be a function.');
    });



      it('should contain "afterUpdate" callback', function() {
        assert(V1UserSurvey.callbacks['afterUpdate'], 'afterUpdate is missing.');
      });

      it('"afterUpdate" callback should be a function', function() {
      assert(_.isFunction(V1UserSurvey.callbacks['afterUpdate']), 'afterUpdate should be a function.');
    });



      it('should contain "beforeDestroy" callback', function() {
        assert(V1UserSurvey.callbacks['beforeDestroy'], 'beforeDestroy is missing.');
      });

      it('"beforeDestroy" callback should be a function', function() {
      assert(_.isFunction(V1UserSurvey.callbacks['beforeDestroy']), 'beforeDestroy should be a function.');
    });



      it('should contain "afterDestroy" callback', function() {
        assert(V1UserSurvey.callbacks['afterDestroy'], 'afterDestroy is missing.');
      });

      it('"afterDestroy" callback should be a function', function() {
      assert(_.isFunction(V1UserSurvey.callbacks['afterDestroy']), 'afterDestroy should be a function.');
    });























  });
});

