def GIT_URL = "https://github.com/vbricci/bryan-ricci.com.git"
def GIT_DEPLOYMENT_URL = "https://github.com/vbricci/iac.git"
def DOCKER_REGISTRY = "bryanricci/bryan-ricci.com"
def DOCKER_REGISTRY_CREDS = "dockerhub"

// [IMPORTANT] Ensure deployment filename is identical to this variable and has the extension ".ymal"
// use ".yaml" NOT ".yml"
def K8S_DEPLOYMENT_NAME = "ui"
def K8S_MASTER_NAMESPACE = "br"

podTemplate(
  containers: [
    containerTemplate(name: 'node', image: 'node:lts', ttyEnabled: true, command: 'cat'),
    containerTemplate(name: 'docker', image: 'docker', ttyEnabled: true, command: 'cat'),
    containerTemplate(name: 'kubectl', image: 'gcr.io/cloud-builders/kubectl', ttyEnabled: true, command: '/bin/bash'),
  ],
  volumes: [
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'),
  ],
  envVars: [
    envVar(key: 'GIT_URL', value: GIT_URL),
    envVar(key: 'BRANCH_NAME', value: BRANCH_NAME),
    envVar(key: 'DOCKER_REGISTRY', value: DOCKER_REGISTRY),
    envVar(key: 'K8S_DEPLOYMENT_NAME', value: K8S_DEPLOYMENT_NAME),
    envVar(key: 'K8S_MASTER_NAMESPACE', value: K8S_MASTER_NAMESPACE),
    envVar(key: 'DOCKER_REGISTRY_CREDS', value: DOCKER_REGISTRY_CREDS),
    envVar(key: 'GIT_DEPLOYMENT_URL', value: GIT_DEPLOYMENT_URL),
  ]
) {
  node(POD_LABEL) {
    stage('Pull from Git') {
      container('node') {
        git branch: env.BRANCH_NAME,
        credentialsId: 'github',
        url: env.GIT_URL
        script {
          PACKAGE_JSON = readJSON file: 'package.json'
          PACKAGE_VERSION = PACKAGE_JSON.version
        }
      }
    }

    stage('Make NPM RC File') {
      container('node') {
        withCredentials([string(credentialsId: 'npm-token', variable: 'NPM_TOKEN')]) {
          sh "echo //registry.npmjs.org/:_authToken=${env.NPM_TOKEN} > .npmrc"
          sh 'npm whoami'
        }
      }
    }

    stage('Build Docker Container') {
      container('docker') {     
        withEnv([
            /* Override the npm cache directory */
            /* Reset Home dir */
            'npm_config_cache=npm-cache',
            'HOME=.',
        ]) {
          script {
            DOCKER_IMAGE = docker.build("$DOCKER_REGISTRY:dev", "-f Dockerfile --build-arg API_HOST=\${API_HOST} --network=host .")
          }
        }
      }
    }

    stage('Publish Docker Container') {
      container('docker') {

        docker.withRegistry( '', DOCKER_REGISTRY_CREDS ) {

          if (env.BRANCH_NAME == 'develop') {
            VERSION = "alpha-${PACKAGE_VERSION}"
            DOCKER_IMAGE.push(VERSION)
            DOCKER_IMAGE.push('dev')
          }
          if (env.BRANCH_NAME == 'release') {
            VERSION = "beta-${PACKAGE_VERSION}"
            DOCKER_IMAGE.push(VERSION)
            DOCKER_IMAGE.push('stage')
          }
          if (env.BRANCH_NAME == 'main') {
            DOCKER_IMAGE.push(PACKAGE_VERSION)
            DOCKER_IMAGE.push('prod')
          }

        }
      }
    }

    stage('Deploy to Kubernetes') {
      container('kubectl') {

        // Git Deployment Script Branch
        git branch: 'main',
        credentialsId: 'github',
        url: env.GIT_DEPLOYMENT_URL
  
        // Execute K8s
        withKubeConfig([credentialsId: 'kubeconfig']) { 
          script {
            IS_DEPLOYMENT = false

            if (env.BRANCH_NAME == 'develop') { 
              IS_DEPLOYMENT = true 
              env.K8S_NAMESPACE = "dev"
            }
            if (env.BRANCH_NAME == 'release') { 
              IS_DEPLOYMENT = true 
              env.K8S_NAMESPACE = "stage"
            }
            if (env.BRANCH_NAME == 'main') { 
              IS_DEPLOYMENT = true 
              env.K8S_NAMESPACE = "prod"
            }

            if (IS_DEPLOYMENT) {
              sh """ 
                cd "\${BRANCH_NAME}"
                kubectl apply -f "\${K8S_DEPLOYMENT_NAME}.yaml"
                kubectl rollout restart deployment.apps/"\${K8S_DEPLOYMENT_NAME}" -n "\${K8S_MASTER_NAMESPACE}-\${K8S_NAMESPACE}"
              """
            }
          }
        }
      }
    }

  }
}