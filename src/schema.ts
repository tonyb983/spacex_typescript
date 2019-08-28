import 'graphql-import-node';
import {
        GraphQLObjectType,
        GraphQLInt,
        GraphQLString,
        GraphQLBoolean,
        GraphQLList,
        GraphQLSchema
    } from 'graphql';
import axios from "axios";

// Launch Type
export interface Launch {
    flight_number?: number,
    mission_name?: string,
    launch_year?: number,
    launch_date_local?: Date,
    launch_success: boolean,
    rocket: Rocket
}

// Launch Graph Type
const LaunchGraphType = new GraphQLObjectType({
    name: "Launch",
    fields: () => ({
        flight_number: { type: GraphQLInt },
        mission_name: { type: GraphQLString },
        launch_year: { type: GraphQLString },
        launch_date_local: { type: GraphQLString },
        launch_success: { type: GraphQLBoolean },
        rocket: { type: RocketGraphType }
    })
});

// Rocket Type
export interface Rocket {
    rocket_id?: string,
    rocket_name?: string,
    rocket_type?: string
}

// Rocket Graph Type
const RocketGraphType = new GraphQLObjectType({
    name: "Rocket",
    fields: () => ({
        rocket_id: { type: GraphQLString },
        rocket_name: { type: GraphQLString },
        rocket_type: { type: GraphQLString }
    })
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        launches: {
            type: GraphQLList(LaunchGraphType),
            async resolve(parent, args) {
                const res = await axios.get("https://api.spacexdata.com/v3/launches");
                return res.data;
            }
        },
        launch: {
            type: LaunchGraphType,
            args: {
                flight_number: { type: GraphQLInt }
            },
            async resolve(parent, args) {
                const res = await axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`);
                return res.data;
            }
        },
        rockets: {
            type: GraphQLList(RocketGraphType),
            async resolve(parent, args) {
                const res = await axios.get("https://api.spacexdata.com/v3/rockets");
                return res.data;
            }
        },
        rocket: {
            type: RocketGraphType,
            args: {
                id: { type: GraphQLInt }
            },
            async resolve(parent, args) {
                const res = await axios.get(`https://api.spacexdata.com/v3/rockets/${args.id}`);
                return res.data;
            }
        }
    }
});

const schema: GraphQLSchema = new GraphQLSchema({
    query: RootQuery
});

export default schema;
