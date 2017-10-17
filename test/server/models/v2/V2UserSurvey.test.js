  var assert = require('assert');
var adapter = require('sails-memory');
var _ = require('lodash');


describe('V2UserSurvey Model', function() {

  afterEach(function() {
    V2UserSurvey.destroy();
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

      adapter.drop('memory', 'user_survey_videos', [], function() {})

      adapter.drop('memory', 'vaccination_reminders', [], function() {})

      adapter.drop('memory', 'videos', [], function() {})

      adapter.drop('memory', 'video_audit_logging', [], function() {})

    // Recreate collections

      adapter.define('memory', 'clinic_block_randomizer', V2ClinicianBlockRandomizer.attributes, function() {})

      adapter.define('memory', 'clinician_codes', V2ClinicianCode.attributes, function() {})

      adapter.define('memory', 'educations', V2Education.attributes, function() {})

      adapter.define('memory', 'healthcare_provider_contents', V2HealthcareProviderContent.attributes, function() {})

      adapter.define('memory', 'job_audit_logging', V2JobAuditLogging.attributes, function() {})

      adapter.define('memory', 'question_categories', V2QuestionCategory.attributes, function() {})

      adapter.define('memory', 'question_codes', V2QuestionCode.attributes, function() {})

      adapter.define('memory', 'question_types', V2QuestionType.attributes, function() {})

      adapter.define('memory', 'races', V2Race.attributes, function() {})

      adapter.define('memory', 'search_audit_logging', V2SearchAuditLogging.attributes, function() {})

      adapter.define('memory', 'SendGrid', V2SendGrid.attributes, function() {})

      adapter.define('memory', 'settings', V2Setting.attributes, function() {})

      adapter.define('memory', 'surveys', V2Survey.attributes, function() {})

      adapter.define('memory', 'survey_answers', V2SurveyAnswer.attributes, function() {})

      adapter.define('memory', 'survey_questions', V2SurveyQuestion.attributes, function() {})

      adapter.define('memory', 'survey_question_skip_logic', V2SurveyQuestionSkipLogic.attributes, function() {})

      adapter.define('memory', 'topics', V2Topic.attributes, function() {})

      adapter.define('memory', 'Twilio', V2Twilio.attributes, function() {})

      adapter.define('memory', 'users', V2User.attributes, function() {})

      adapter.define('memory', 'user_audit_logging', V2UserAuditLogging.attributes, function() {})

      adapter.define('memory', 'user_surveys', V2UserSurvey.attributes, function() {})

      adapter.define('memory', 'user_survey_answers', V2UserSurveyAnswer.attributes, function() {})

      adapter.define('memory', 'user_survey_videos', V2UserSurveyVideo.attributes, function() {})

      adapter.define('memory', 'vaccination_reminders', V2VaccinationReminder.attributes, function() {})

      adapter.define('memory', 'videos', V2Video.attributes, function() {})

      adapter.define('memory', 'video_audit_logging', V2VideoAuditLogging.attributes, function() {})

  });

  it('should successfully create an instance of V2UserSurvey', function(done) {
    var beforeCount;

    V2UserSurvey.count()
      .then(function(count) {
        beforeCount = count;
        return V2UserSurvey.create({"completedAt":"Larcenous unfaithfulness","completition":43412,"createdAt":"2004-08-07 14:18:29 +0000","currentuseranswers":[1,2,3],"firstQuestion":{"one":1,"two":2,"three":3},"firstQuestionId":38063,"firstReminder":true,"isComplete":false,"matchedVideos":[1,2,3],"maternalVideoComplete":true,"maternalVideoNumber":"Monotonously socialists","maternalVideoPosition":41283.759908407985,"pediatricVideoComplete":false,"pediatricVideoNumber":"Slaughterhouses cartwheeling","pediatricVideoPosition":97392.56741507794,"questionCount":89013,"secondReminder":false,"surveyId":92382,"userId":78967,"videoSourceVersion":"Assailed Joplin"});
      })
      .then(function(obj) {
        assert(obj, 'Failed to create object.');
        return V2UserSurvey.count();
      })
      .then(function(count) {
        assert(count > beforeCount, 'Expected create to increase object count.');
        done();
      })
      .catch(function (exception) {
        done(exception);
      });
  });

  it('should successfully read an instance of V2UserSurvey', function(done) {

    var attributes = {"completedAt":"Exude tranquilizers","completition":88320,"createdAt":"1986-10-30 22:01:54 +0000","currentuseranswers":[1,2,3],"firstQuestion":{"one":1,"two":2,"three":3},"firstQuestionId":67603,"firstReminder":true,"isComplete":false,"matchedVideos":[1,2,3],"maternalVideoComplete":true,"maternalVideoNumber":"Litany nicety","maternalVideoPosition":72463.44306202293,"pediatricVideoComplete":true,"pediatricVideoNumber":"Creighton Hermaphroditus","pediatricVideoPosition":11703.348840592103,"questionCount":83316,"secondReminder":true,"surveyId":63478,"userId":18390,"videoSourceVersion":"Soreness Arlene"};
    var id;

    if (attributes && Object.keys(attributes).length !== 0) {
      V2UserSurvey.findOne(attributes)
        .then(function(record) {
          assert(!record, 'Should not have found a record.');
          return V2UserSurvey.create(attributes);
        })
        .then(function(obj) {
          assert(obj, 'Failed to create object.');
          id = obj.id;
          return V2UserSurvey.findOne({'id':obj.id});
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

  it('should successfully update an instance of V2UserSurvey', function(done) {
    var attributes = {"completedAt":"Conveyer absurdities","completition":45893,"createdAt":"1990-08-03 08:43:02 +0000","currentuseranswers":[1,2,3],"firstQuestion":{"one":1,"two":2,"three":3},"firstQuestionId":75892,"firstReminder":true,"isComplete":true,"matchedVideos":[1,2,3],"maternalVideoComplete":true,"maternalVideoNumber":"Gallagher negativing","maternalVideoPosition":44518.7563185597,"pediatricVideoComplete":true,"pediatricVideoNumber":"Encyclopaedias receptionists","pediatricVideoPosition":36194.98046494724,"questionCount":60549,"secondReminder":false,"surveyId":31969,"userId":79386,"videoSourceVersion":"Motivates flippantly"};
    var updatedObject;

    V2UserSurvey.create(attributes)
      .then(function(obj) {
        assert(obj, 'Failed to create object.');
        var attributes = {"completedAt":"Hardheartedness reconsidering","completition":29578,"createdAt":"1979-04-25 19:25:18 +0000","currentuseranswers":[1,2,3],"firstQuestion":{"one":1,"two":2,"three":3},"firstQuestionId":12493,"firstReminder":false,"isComplete":false,"matchedVideos":[1,2,3],"maternalVideoComplete":true,"maternalVideoNumber":"Nanjing mattock","maternalVideoPosition":37196.09248160234,"pediatricVideoComplete":true,"pediatricVideoNumber":"Pupils piercings","pediatricVideoPosition":20365.244889454265,"questionCount":91847,"secondReminder":true,"surveyId":44716,"userId":99877,"videoSourceVersion":"Nefariousness equivocation"};
        return V2UserSurvey.update(obj.id, attributes);
      })
      .then(function(collection) {
        updatedObject = collection[0];
        assert(updatedObject, 'Failed to update object.');
        return V2UserSurvey.findOne({'id':updatedObject.id});
      })
      .then(function(obj) {
        assert(obj.id === updatedObject.id, 'Expected to find the instance just created.');
        done();
      })
      .catch(function (exception) {
        done(exception);
      });
  });

  it('should successfully destroy an instance of V2UserSurvey', function(done) {

    var attributes = {"completedAt":"Imperial cello","completition":98239,"createdAt":"2005-11-23 09:24:06 +0000","currentuseranswers":[1,2,3],"firstQuestion":{"one":1,"two":2,"three":3},"firstQuestionId":28087,"firstReminder":true,"isComplete":true,"matchedVideos":[1,2,3],"maternalVideoComplete":false,"maternalVideoNumber":"Modestly abler","maternalVideoPosition":51723.154946955015,"pediatricVideoComplete":true,"pediatricVideoNumber":"Lumberjacks allied","pediatricVideoPosition":69375.25191609985,"questionCount":55599,"secondReminder":true,"surveyId":53780,"userId":54486,"videoSourceVersion":"Defeatists plugging"};

    if (attributes && Object.keys(attributes).length !== 0) {
      V2UserSurvey.findOne(attributes)
        .then(function(record) {
          assert(!record, 'Should not have found a record.');
          return V2UserSurvey.create(attributes);
        })
        .then(function(obj) {
          assert(obj, 'Failed to create object.');
          return V2UserSurvey.destroy(obj.id);
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
    assert(V2UserSurvey.transientAttributes.indexOf('completition') !== -1);
  });

  it('should have a getter', function() {
    assert(V2UserSurvey.attributes['getCompletition']);
  });



  it('should have the correct transientAttributes', function() {
    assert(V2UserSurvey.transientAttributes.indexOf('currentuseranswers') !== -1);
  });

  it('should have a getter', function() {
    assert(V2UserSurvey.attributes['getCurrentuseranswers']);
  });



  it('should have the correct transientAttributes', function() {
    assert(V2UserSurvey.transientAttributes.indexOf('firstQuestion') !== -1);
  });

  it('should have a getter', function() {
    assert(V2UserSurvey.attributes['getFirstQuestion']);
  });



  it('should have the correct transientAttributes', function() {
    assert(V2UserSurvey.transientAttributes.indexOf('matchedVideos') !== -1);
  });

  it('should have a getter', function() {
    assert(V2UserSurvey.attributes['getMatchedVideos']);
  });


  it('should have the correct transientAttributes for 30 day post video survey', function() {
    assert(V2UserSurvey.transientAttributes.indexOf('postMatchedVideos') !== -1);
  });

  it('should have a getter', function() {
    assert(V2UserSurvey.attributes['getPostMatchedVideos']);
  });



  describe('custom callbacks', function() {
    it('should have a callbacks object', function() {
      assert(V2UserSurvey.callbacks, 'V2UserSurvey is missing the callbacks object');
    });




      it('should contain "beforeCreate" callback', function() {
        assert(V2UserSurvey.callbacks['beforeCreate'], 'beforeCreate is missing.');
      });

      it('"beforeCreate" callback should be a function', function() {
      assert(_.isFunction(V2UserSurvey.callbacks['beforeCreate']), 'beforeCreate should be a function.');
    });



      it('should contain "afterCreate" callback', function() {
        assert(V2UserSurvey.callbacks['afterCreate'], 'afterCreate is missing.');
      });

      it('"afterCreate" callback should be a function', function() {
      assert(_.isFunction(V2UserSurvey.callbacks['afterCreate']), 'afterCreate should be a function.');
    });



      it('should contain "beforeFind" callback', function() {
        assert(V2UserSurvey.callbacks['beforeFind'], 'beforeFind is missing.');
      });

      it('"beforeFind" callback should be a function', function() {
      assert(_.isFunction(V2UserSurvey.callbacks['beforeFind']), 'beforeFind should be a function.');
    });



      it('should contain "afterFind" callback', function() {
        assert(V2UserSurvey.callbacks['afterFind'], 'afterFind is missing.');
      });

      it('"afterFind" callback should be a function', function() {
      assert(_.isFunction(V2UserSurvey.callbacks['afterFind']), 'afterFind should be a function.');
    });



      it('should contain "beforeUpdate" callback', function() {
        assert(V2UserSurvey.callbacks['beforeUpdate'], 'beforeUpdate is missing.');
      });

      it('"beforeUpdate" callback should be a function', function() {
      assert(_.isFunction(V2UserSurvey.callbacks['beforeUpdate']), 'beforeUpdate should be a function.');
    });



      it('should contain "afterUpdate" callback', function() {
        assert(V2UserSurvey.callbacks['afterUpdate'], 'afterUpdate is missing.');
      });

      it('"afterUpdate" callback should be a function', function() {
      assert(_.isFunction(V2UserSurvey.callbacks['afterUpdate']), 'afterUpdate should be a function.');
    });



      it('should contain "beforeDestroy" callback', function() {
        assert(V2UserSurvey.callbacks['beforeDestroy'], 'beforeDestroy is missing.');
      });

      it('"beforeDestroy" callback should be a function', function() {
      assert(_.isFunction(V2UserSurvey.callbacks['beforeDestroy']), 'beforeDestroy should be a function.');
    });



      it('should contain "afterDestroy" callback', function() {
        assert(V2UserSurvey.callbacks['afterDestroy'], 'afterDestroy is missing.');
      });

      it('"afterDestroy" callback should be a function', function() {
      assert(_.isFunction(V2UserSurvey.callbacks['afterDestroy']), 'afterDestroy should be a function.');
    });























  });
});

