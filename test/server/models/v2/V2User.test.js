  var assert = require('assert');
var adapter = require('sails-memory');
var _ = require('lodash');


describe('V2User Model', function() {

  afterEach(function() {
    V2User.destroy();
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

  it('should successfully create an instance of V2User', function(done) {
    var beforeCount;

    V2User.count()
      .then(function(count) {
        beforeCount = count;
        return V2User.create({"actualChildBirth":"2015-05-02","address":"Disestablishing Mitsubishi","cellPhone":"Dossier Schwarzenegger","city":"Revolutionists marigolds","clinicianCodeId":30523,"clinicName":"Uninsured acquaintances","consentAcceptedOn":"1997-06-18 02:04:04 +0000","contactCellPhone":"Bolshevist foolhardiness","contactEmail":"Henpecked shucked","contactHomePhone":"Detoxification trousers","contactName":"Reportedly friendless","deactivatedOn":"1977-08-16 07:22:17 +0000","educationId":51679,"email":"shelton.hilpert6@vaccinesurvey.com","expectedChildBirth":"2015-01-15","firstName":"Tamekia","hasContactUsers":true,"homePhone":"Temperamentally disengagements","interventionGroup":"Theorist radiotherapists","isDeactive":true,"lastName":"Hand","parentRelationshipType":"Balminess consensuses","parentUserId":95249,"password":"password","passwordConfirmation":"password","passwordDigest":"Expressiveness coagulation","patientType":41731,"postalCode":"Gagging incinerator","raceId":63804,"reasonForDeactivation":"Chlorine receivership","resetPassword":false,"role":"Arsonist philosophized","state":"Predicaments jeeringly","updatedUserProfile":false,"vaccinationReminders":false,"xSessionId":"Relies Donne"});
      })
      .then(function(obj) {
        assert(obj, 'Failed to create object.');
        return V2User.count();
      })
      .then(function(count) {
        assert(count > beforeCount, 'Expected create to increase object count.');
        done();
      })
      .catch(function (exception) {
        done(exception);
      });
  });

  it('should successfully read an instance of V2User', function(done) {

    var attributes = {"actualChildBirth":"2015-04-25","address":"Hosea disciplinarians","cellPhone":"Preordained vials","city":"Venerating promotional","clinicianCodeId":58232,"clinicName":"Willis counterfeiting","consentAcceptedOn":"1997-07-12 22:59:24 +0000","contactCellPhone":"Cohan excommunication","contactEmail":"Visionaries Walpurgisnacht","contactHomePhone":"Embarrassingly preferentially","contactName":"Editorializing missionaries","deactivatedOn":"1996-08-09 17:56:11 +0000","educationId":45141,"email":"soraya.harvey5@vaccinesurvey.com","expectedChildBirth":"2014-08-28","firstName":"Dion","hasContactUsers":false,"homePhone":"Resourcefulness vireo","interventionGroup":"Outmanoeuvre autobiographies","isDeactive":false,"lastName":"Kutch","parentRelationshipType":"Gleamings freehand","parentUserId":281,"password":"password","passwordConfirmation":"password","passwordDigest":"Minces parenthetical","patientType":42982,"postalCode":"Harrowed mellifluously","raceId":98033,"reasonForDeactivation":"Cokes brighter","resetPassword":true,"role":"Delicatessens cowling","state":"Optimizing verisimilitude","updatedUserProfile":false,"vaccinationReminders":false,"xSessionId":"Farrakhan metabolizing"};
    var id;

    if (attributes && Object.keys(attributes).length !== 0) {
      V2User.findOne(attributes)
        .then(function(record) {
          assert(!record, 'Should not have found a record.');
          return V2User.create(attributes);
        })
        .then(function(obj) {
          assert(obj, 'Failed to create object.');
          id = obj.id;
          return V2User.findOne({'id':obj.id});
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

  it('should successfully update an instance of V2User', function(done) {
    var attributes = {"actualChildBirth":"2016-03-13","address":"Preregistration conscientiously","cellPhone":"Boasting outsiders","city":"Frosts disestablished","clinicianCodeId":76165,"clinicName":"Ashed untruthfully","consentAcceptedOn":"2004-02-02 18:33:52 +0000","contactCellPhone":"Surreptitiously accolade","contactEmail":"Persecuting inappropriate","contactHomePhone":"Incinerators Ceausescu","contactName":"Neuroses derivative","deactivatedOn":"1982-04-18 17:49:12 +0000","educationId":81334,"email":"ellsworth.schamberger56@vaccinesurvey.com","expectedChildBirth":"2016-12-31","firstName":"Samuel","hasContactUsers":true,"homePhone":"Gentrification sneaks","interventionGroup":"Switchbacks repetitive","isDeactive":true,"lastName":"Schuppe","parentRelationshipType":"Discharged sundry","parentUserId":59592,"password":"password","passwordConfirmation":"password","passwordDigest":"Shocked illustrates","patientType":5996,"postalCode":"Misconstruing disorderliness","raceId":56097,"reasonForDeactivation":"Fluoridating Angkor","resetPassword":false,"role":"Slings constitutionals","state":"Nonscheduled macadam","updatedUserProfile":true,"vaccinationReminders":false,"xSessionId":"Friendliness hallucinogenics"};
    var updatedObject;

    V2User.create(attributes)
      .then(function(obj) {
        assert(obj, 'Failed to create object.');
        var attributes = {"actualChildBirth":"2016-07-30","address":"Foreclosures ribbon","cellPhone":"Manufacturers tallness","city":"Fingerprinting aquaculture","clinicianCodeId":12052,"clinicName":"Exorbitantly tambourines","consentAcceptedOn":"2008-04-14 22:04:43 +0000","contactCellPhone":"Clotted frustrations","contactEmail":"Compositor granddaughter","contactHomePhone":"Storehouses overconfident","contactName":"Circumscribed redistributing","deactivatedOn":"1977-09-07 15:26:19 +0000","educationId":1743,"email":"georgianna.schowalter39@vaccinesurvey.com","expectedChildBirth":"2015-03-08","firstName":"Fausto","hasContactUsers":true,"homePhone":"Proportionality woody","interventionGroup":"Kirsten synthesizes","isDeactive":true,"lastName":"Howe","parentRelationshipType":"Brahmanisms decanter","parentUserId":81137,"password":"password","passwordConfirmation":"password","passwordDigest":"Commingles egoist","patientType":50588,"postalCode":"Wavelength turtledoves","raceId":73647,"reasonForDeactivation":"Impersonator spade","resetPassword":true,"role":"Editorialized inviolability","state":"Blatant qualification","updatedUserProfile":false,"vaccinationReminders":false,"xSessionId":"Doormen misinformation"};
        return V2User.update(obj.id, attributes);
      })
      .then(function(collection) {
        updatedObject = collection[0];
        assert(updatedObject, 'Failed to update object.');
        return V2User.findOne({'id':updatedObject.id});
      })
      .then(function(obj) {
        assert(obj.id === updatedObject.id, 'Expected to find the instance just created.');
        done();
      })
      .catch(function (exception) {
        done(exception);
      });
  });

  it('should successfully destroy an instance of V2User', function(done) {

    var attributes = {"actualChildBirth":"2015-04-21","address":"Hammond eyewitnesses","cellPhone":"Nefariousness catholicity","city":"Individualizes Liberian","clinicianCodeId":23727,"clinicName":"Overpopulates absconded","consentAcceptedOn":"1979-09-07 11:14:05 +0000","contactCellPhone":"Abstention Huntley","contactEmail":"Enquiries semiprecious","contactHomePhone":"Herds unrealistically","contactName":"Altai staving","deactivatedOn":"1992-11-20 04:37:26 +0000","educationId":10589,"email":"talisha.oberbrunner65@vaccinesurvey.com","expectedChildBirth":"2017-02-06","firstName":"Jerold","hasContactUsers":true,"homePhone":"Moniker telescopes","interventionGroup":"Lupus slick","isDeactive":true,"lastName":"Stark","parentRelationshipType":"Nonpolluting entrenched","parentUserId":92390,"password":"password","passwordConfirmation":"password","passwordDigest":"Adams depoliticize","patientType":70823,"postalCode":"Eternity wristwatch","raceId":42962,"reasonForDeactivation":"Practicalities personalizes","resetPassword":true,"role":"Unsuccessfully Baden","state":"Indochinese demonstrably","updatedUserProfile":false,"vaccinationReminders":true,"xSessionId":"Inefficiencies interjections"};

    if (attributes && Object.keys(attributes).length !== 0) {
      V2User.findOne(attributes)
        .then(function(record) {
          assert(!record, 'Should not have found a record.');
          return V2User.create(attributes);
        })
        .then(function(obj) {
          assert(obj, 'Failed to create object.');
          return V2User.destroy(obj.id);
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
    assert(V2User.transientAttributes.indexOf('clinicName') !== -1);
  });

  it('should have a getter', function() {
    assert(V2User.attributes['getClinicName']);
  });



  it('should have the correct transientAttributes', function() {
    assert(V2User.transientAttributes.indexOf('password') !== -1);
  });

  it('should have a getter', function() {
    assert(V2User.attributes['getPassword']);
  });



  it('should have the correct transientAttributes', function() {
    assert(V2User.transientAttributes.indexOf('passwordConfirmation') !== -1);
  });

  it('should have a getter', function() {
    assert(V2User.attributes['getPasswordConfirmation']);
  });



  it('should have the correct transientAttributes', function() {
    assert(V2User.transientAttributes.indexOf('xSessionId') !== -1);
  });

  it('should have a getter', function() {
    assert(V2User.attributes['getXSessionId']);
  });

  it('should have the correct transientAttributes for create timestamp', function() {
    assert(V2User.transientAttributes.indexOf('createdAt') !== -1);
  });

  it('should have a getter', function() {
    assert(V2User.attributes['getCreatedAt']);
  });







  describe('Authenticatable logout callback', function() {
    it('should have the proper method name configured in the model', function() {
      assert.equal(V2User.logoutCb, 'auditlogout');
    });

    it('should exist in the customCode', function() {
      assert(_.isFunction(V2User.customCode['auditlogout']),
                          'Logout callback auditlogout is configured but cannot be found or is not a function.');
    });
  });


  describe('custom callbacks', function() {
    it('should have a callbacks object', function() {
      assert(V2User.callbacks, 'V2User is missing the callbacks object');
    });




      it('should contain "beforeCreate" callback', function() {
        assert(V2User.callbacks['beforeCreate'], 'beforeCreate is missing.');
      });

      it('"beforeCreate" callback should be a function', function() {
      assert(_.isFunction(V2User.callbacks['beforeCreate']), 'beforeCreate should be a function.');
    });



      it('should contain "afterCreate" callback', function() {
        assert(V2User.callbacks['afterCreate'], 'afterCreate is missing.');
      });

      it('"afterCreate" callback should be a function', function() {
      assert(_.isFunction(V2User.callbacks['afterCreate']), 'afterCreate should be a function.');
    });



      it('should contain "beforeFind" callback', function() {
        assert(V2User.callbacks['beforeFind'], 'beforeFind is missing.');
      });

      it('"beforeFind" callback should be a function', function() {
      assert(_.isFunction(V2User.callbacks['beforeFind']), 'beforeFind should be a function.');
    });



      it('should contain "afterFind" callback', function() {
        assert(V2User.callbacks['afterFind'], 'afterFind is missing.');
      });

      it('"afterFind" callback should be a function', function() {
      assert(_.isFunction(V2User.callbacks['afterFind']), 'afterFind should be a function.');
    });



      it('should contain "beforeUpdate" callback', function() {
        assert(V2User.callbacks['beforeUpdate'], 'beforeUpdate is missing.');
      });

      it('"beforeUpdate" callback should be a function', function() {
      assert(_.isFunction(V2User.callbacks['beforeUpdate']), 'beforeUpdate should be a function.');
    });



      it('should contain "afterUpdate" callback', function() {
        assert(V2User.callbacks['afterUpdate'], 'afterUpdate is missing.');
      });

      it('"afterUpdate" callback should be a function', function() {
      assert(_.isFunction(V2User.callbacks['afterUpdate']), 'afterUpdate should be a function.');
    });



      it('should contain "beforeDestroy" callback', function() {
        assert(V2User.callbacks['beforeDestroy'], 'beforeDestroy is missing.');
      });

      it('"beforeDestroy" callback should be a function', function() {
      assert(_.isFunction(V2User.callbacks['beforeDestroy']), 'beforeDestroy should be a function.');
    });



      it('should contain "afterDestroy" callback', function() {
        assert(V2User.callbacks['afterDestroy'], 'afterDestroy is missing.');
      });

      it('"afterDestroy" callback should be a function', function() {
      assert(_.isFunction(V2User.callbacks['afterDestroy']), 'afterDestroy should be a function.');
    });

























  });
});

