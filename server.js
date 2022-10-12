import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql';
import data from './data.json';
 // GraphQL schema
var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

var getCourse = function(args) { 
    var id = args.id;
    return data.filter(course => {
        return course.id == id;
    })[0];
}
var getCourses = function(args) {
    if (args.topic) {
        var topic = args.topic;
        return data.filter(course => course.topic === topic);
    } else {
        return data;
    }
}
var updateCourseTopic = function({id, topic}) {
    data.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return data.filter(course => course.id === id) [0];
}


var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));