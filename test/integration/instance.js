var helper = require('../support/spec_helper');
var ORM = require('../../');

describe("Model instance", function () {
    var db = null;
    var Person = null;

    var setup = function () {
        db.settings.set('instance.returnAllErrors', true);
        
        Person = db.define("person", {
            name: String,
            age: {
                type: 'integer',
                required: false
            },
            height: {
                type: 'integer',
                required: false
            },
            weight: {
                type: 'number',
                required: false,
                enumerable: true
            },
            secret: {
                type: 'text',
                required: false,
                enumerable: false
            },
            data: {
                type: 'object',
                required: false
            }
        }, {
            identityCache: false,
            validations: {
                age: ORM.validators.rangeNumber(0, 150)
            }
        });

        helper.dropSync(Person, function () {
            Person.createSync([{
                name: "Jeremy Doe"
            }, {
                name: "John Doe"
            }, {
                name: "Jane Doe"
            }]);
        });
    };

    before(function () {
        db = helper.connect();
        setup();
    });

    after(function () {
        return db.closeSync();
    });

    describe("#save", function () {
        var main_item, item;

        before(function () {
            main_item = db.define("main_item", {
                name: String
            }, {
                auteFetch: true
            });

            item = db.define("item", {
                name: String
            }, {
                identityCache: false
            });

            item.hasOne("main_item", main_item, {
                reverse: "items",
                autoFetch: true
            });

            helper.dropSync([main_item, item], function () {
                var mainItem = main_item.createSync({
                    name: "Main Item"
                });

                var Item = item.createSync({
                    name: "Item"
                });

                var r = mainItem.setItemsSync(Item);
            });
        });

        it("should have a saving state to avoid loops", function () {
            var mainItem = main_item.find({
                name: "Main Item"
            }).firstSync();
            mainItem.saveSync({
                name: "new name"
            });
        });
    });

    describe("#isInstance", function () {
        it("should always return true for instances", function () {
            assert.equal((new Person).isInstance, true);
            assert.equal((Person(4)).isInstance, true);

            var item = Person.find().firstSync();
            assert.equal(item.isInstance, true);
        });

        it("should be false for all other objects", function () {
            assert.notEqual({}.isInstance, true);
            assert.notEqual([].isInstance, true);
        });
    });

    describe("#isPersisted", function () {
        it("should return true for persisted instances", function () {
            var item = Person.find().firstSync();
            assert.equal(item.isPersisted(), true);
        });

        it("should return true for shell instances", function () {
            assert.equal(Person(4).isPersisted(), true);
        });

        it("should return false for new instances", function () {
            assert.equal((new Person).isPersisted(), false);
        });

        it("should be writable for mocking", function () {
            var person = new Person()
            var triggered = false;
            person.isPersisted = function () {
                triggered = true;
            };
            person.isPersisted()
            assert.isTrue(triggered);
        });
    });

    describe("#set", function () {
        var person = null;
        var data = null;

        function clone(obj) {
            return JSON.parse(JSON.stringify(obj))
        };

        beforeEach(function () {
            data = {
                a: {
                    b: {
                        c: 3,
                        d: 4
                    }
                },
                e: 5
            };
            var p = Person.createSync({
                name: 'Dilbert',
                data: data
            });
            person = p;
        });

        it("should do nothing with flat paths when setting to same value", function () {
            assert.equal(person.saved(), true);
            person.set('name', 'Dilbert');
            assert.equal(person.name, 'Dilbert');
            assert.equal(person.saved(), true);
        });

        it("should mark as dirty with flat paths when setting to different value", function () {
            assert.equal(person.saved(), true);
            person.set('name', 'Dogbert');
            assert.equal(person.name, 'Dogbert');
            assert.equal(person.saved(), false);
            assert.equal(person.__opts.changes.join(','), 'name');
        });

        it("should do nothin with deep paths when setting to same value", function () {
            assert.equal(person.saved(), true);
            person.set('data.e', 5);

            var expected = clone(data);
            expected.e = 5;

            assert.equal(JSON.stringify(person.data), JSON.stringify(expected));
            assert.equal(person.saved(), true);
        });

        it("should mark as dirty with deep paths when setting to different value", function () {
            assert.equal(person.saved(), true);
            person.set('data.e', 6);

            var expected = clone(data);
            expected.e = 6;

            assert.equal(JSON.stringify(person.data), JSON.stringify(expected));
            assert.equal(person.saved(), false);
            assert.equal(person.__opts.changes.join(','), 'data');
        });

        it("should do nothing with deeper paths when setting to same value", function () {
            assert.equal(person.saved(), true);
            person.set('data.a.b.d', 4);

            var expected = clone(data);
            expected.a.b.d = 4;

            assert.equal(JSON.stringify(person.data), JSON.stringify(expected));
            assert.equal(person.saved(), true);
        });

        it("should mark as dirty with deeper paths when setting to different value", function () {
            assert.equal(person.saved(), true);
            person.set('data.a.b.d', 6);

            var expected = clone(data);
            expected.a.b.d = 6;

            assert.equal(JSON.stringify(person.data), JSON.stringify(expected));
            assert.equal(person.saved(), false);
            assert.equal(person.__opts.changes.join(','), 'data');
        });

        it("should mark as dirty with array path when setting to different value", function () {
            assert.equal(person.saved(), true);
            person.set(['data', 'a', 'b', 'd'], 6);

            var expected = clone(data);
            expected.a.b.d = 6;

            assert.equal(JSON.stringify(person.data), JSON.stringify(expected));
            assert.equal(person.saved(), false);
            assert.equal(person.__opts.changes.join(','), 'data');
        });

        it("should do nothing with invalid paths", function () {
            assert.equal(person.saved(), true);
            person.set('data.a.b.d.y.z', 1);
            person.set('data.y.z', 1);
            person.set('z', 1);
            person.set(4, 1);
            person.set(null, 1);
            person.set(undefined, 1);
            assert.equal(person.saved(), true);
        });
    });

    describe("#markAsDirty", function () {
        var person = null;

        beforeEach(function () {
            var p = Person.createSync({
                name: 'John',
                age: 44,
                data: {
                    a: 1
                }
            });
            person = p;
        });

        it("should mark individual properties as dirty", function () {
            assert.equal(person.saved(), true);
            person.markAsDirty('name');
            assert.equal(person.saved(), false);
            assert.equal(person.__opts.changes.join(','), 'name');
            person.markAsDirty('data');
            assert.equal(person.__opts.changes.join(','), 'name,data');
        });
    });

    describe("#dirtyProperties", function () {
        var person = null;

        beforeEach(function () {
            var p = Person.createSync({
                name: 'John',
                age: 44,
                data: {
                    a: 1
                }
            });
            person = p;
        });

        it("should mark individual properties as dirty", function () {
            assert.equal(person.saved(), true);
            person.markAsDirty('name');
            person.markAsDirty('data');
            assert.equal(person.saved(), false);
            assert.equal(person.dirtyProperties.join(','), 'name,data');
        });
    });

    describe("#isShell", function () {
        it("should return true for shell models", function () {
            assert.equal(Person(4).isShell(), true);
        });

        it("should return false for new models", function () {
            assert.equal((new Person).isShell(), false);
        });

        it("should return false for existing models", function () {
            var item = Person.find().firstSync();
            assert.equal(item.isShell(), false);
        });
    });

    describe("#validate", function () {
        it("should return validation errors if invalid", function () {
            var person = new Person({
                age: -1
            });

            var validationErrors = person.validateSync();
            assert.equal(Array.isArray(validationErrors), true);
        });

        it("should return false if valid", function () {
            var person = new Person({
                name: 'Janette'
            });

            var validationErrors = person.validateSync();
            assert.equal(validationErrors, false);
        });
    });

    describe("properties", function () {
        describe("Number", function () {
            it("should be saved for valid numbers, using both save & create", function () {
                var person1 = new Person({
                    height: 190
                });

                person1.saveSync();

                var person2 = Person.createSync({
                    height: 170
                });

                var item = Person.getSync(person1[Person.id]);

                assert.equal(item.height, 190);

                item = Person.getSync(person2[Person.id]);
                assert.equal(item.height, 170);
            });
        });

        describe("Enumerable", function () {
            it("should not stringify properties marked as not enumerable", function () {
                var p = Person.createSync({
                    name: 'Dilbert',
                    secret: 'dogbert',
                    weight: 100,
                    data: {
                        data: 3
                    }
                });

                var result = JSON.parse(JSON.stringify(p));
                assert.notExist(result.secret);
                assert.exist(result.weight);
                assert.exist(result.data);
                assert.exist(result.name);
            });
        });
    });
});