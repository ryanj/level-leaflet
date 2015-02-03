# Map of National Parks and Historic Sites 
*powered by RESTify, LevelDB, and Leaflet maps*

[![Build Status](http://img.shields.io/jenkins/s/https/build-shifter.rhcloud.com/levelparks-build.svg)](https://build-shifter.rhcloud.com/job/levelparks-build/) [![Dependency Check](http://img.shields.io/david/ryanj/level-leaflet.svg)](https://david-dm.org/ryanj/level-leaflet)

[![Launch on OpenShift](https://launch-shifter.rhcloud.com/launch.svg)](https://openshift.redhat.com/app/console/application_type/custom?name=levelparks&cartridges%5B%5D=nodejs-0.10&initial_git_url=https%3A%2F%2Fgithub.com%2Fryanj%2Flevel-leaflet.git)

A basic instant mapping demo using LevelDB, node-restify, LeafLet Maps and map tiles from Stamen, to visualize the locations of major National Parks and Historic Sites.

<a href='http://levelparks-shifter.rhcloud.com/'><img src='https://www.openshift.com/sites/default/files/Parks_preview.png'/></a>

Related post on OpenShift.com: [https://www.openshift.com/blogs/instant-mapping-applications-with-postgis-and-nodejs](https://www.openshift.com/blogs/instant-mapping-applications-with-postgis-and-nodejs)

## Instant Provisioning on OpenShift

To deploy a clone of this application using the [`rhc` command line tool](http://rubygems.org/gems/rhc), type:

    rhc app create parks nodejs-0.10 --from-code=https://github.com/ryanj/level-leaflet.git
    
Or, [link to a web-based **clone+deploy**](https://openshift.redhat.com/app/console/application_type/custom?name=levelparks&cartridges%5B%5D=nodejs-0.10&initial_git_url=https%3A%2F%2Fgithub.com%2Fryanj%2level-leaflet.git) on [OpenShift Online](http://OpenShift.com) or [your own open cloud](http://openshift.github.io): 

    https://openshift.redhat.com/app/console/application_type/custom?name=levelparks&cartridges%5B%5D=nodejs-0.10&initial_git_url=https%3A%2F%2Fgithub.com%2Fryanj%2Flevel-leaflet.git

A live demo is available at: [http://levelparks-shifter.rhcloud.com/](http://levelparks-shifter.rhcloud.com/)

## Local Development
Before you spin up a local server, you'll need a copy of the source code, and an installation of [nodejs](http://nodejs.org/).

If you created a clone of the application using the `rhc` command (above), then you should already have a local copy of the source code available.  If not, you can try cloning the repo using `git`, or taking advantage of the `rhc git-clone` command to fetch a local clone of any of your existing OpenShift applications:

    rhc git-clone parks

OpenShift will automatically resolve `package.json` dependencies for hosted applications as a normal part of it's automated build process.  In your local development environment, you'll need to run `npm install` in order to ensure that your application's package dependencies are available:

    npm install

### Basic Configuration
This app uses the `config` npm module, which loads it's configuration details from the `config/defaults.json` file.  This configuration takes advantage of several environment variables whenever they are available.  On OpenShift, many of these values are automatically provided for your application by their associated cartridge add-on service:

    module.exports = {
      port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
      ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
      table_name: process.env.OPENSHIFT_APP_NAME || 'parks'
    }

Sensible defaults allow us to run the same code in multiple environments. 

#### Starting your Local Webserver
With your dependencies installed, your port-forwarding tunnel established, and your environment variables set, firing up a local server should be as simple as typing:

    npm start

Your dev server should be available at the default address: [localhost:8080](http://localhost:8080)

## Deploying updates to OpenShift
When you're ready, you can push changes to your OpenShift-hosted application environment using the standard `git` workflow:

1. Add your changes to a changeset:

    `git add filename1 filename2`

2. Mark the changeset as a Commit:

    `git commit -m 'describe your changes here'`

3. Push the Commit to OpenShift

    `git push`

## License
This code is dedicated to the public domain to the maximum extent permitted by applicable law, pursuant to CC0 (http://creativecommons.org/publicdomain/zero/1.0/)
