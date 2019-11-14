// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require('jasmine-spec-reporter');
const jasmineReporters = require('jasmine-reporters');
const HTMLReport = require('protractor-html-reporter');

exports.config = {
	seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
	allScriptsTimeout: 10000,
	specs: [
		'./src/**/*.e2e-spec.ts'
	],
	suites:{
		systems:{
			deploymentPage:'./modules/system/components/deployments/*.e2e-spec.ts'
		},
		deployment:'./modules/system/components/deployments/*.e2e-spec.ts',
		complete:'./src/**/*.e2e-spec.ts'
	},
	plugins: [{
		package: 'jasmine2-protractor-utils',
		disableHTMLReport: false,
		disableScreenshot: false,
		testBrowser: 'chrome-browser',
		screenshotPath: './e2e/reports/screenshots',
		htmlReportDir: './e2e/reports/htmlReports',
		screenshotOnExpectFailure: true,
		screenshotOnSpecFailure: true,
		clearFoldersBeforeTest: true
	}],
	capabilities: {
		'browserName': 'chrome',
		chromeOptions: {
			args: ['--headless', '--disable-gpu', '--window-size=800,600']
		}
	},
	directConnect: false,
	baseUrl: 'https://localhost:6749/admin/',
	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000,
		print: function () {
		}
	},
	onPrepare() {
		require('ts-node').register({
			project: require('path').join(__dirname, './tsconfig.e2e.json')
		});
		jasmine.getEnv().addReporter(
			new SpecReporter({
				spec: {
					displayDuration: true,  // display each spec duration
					displayStacktrace: true // display stackTrace of each spec
				},
				summary: {
					displaySuccesses: true, // display summary of all successes after execution
					displayStacktrace: false, // display stackTrace of all failed specs after execution
					displayFailed: true,    // display summary of all failures after execution
					displayPending: true,   // display summary of all pending specs after execution
				}
			})
		);
		jasmine.getEnv().addReporter(
			new jasmineReporters.JUnitXmlReporter({
				consolidateAll: true,
				savePath: './e2e/spec_results/',
				filePrefix: 'spec_xml_results'
			}));
	},
	//HTMLReport called once tests are finished
	onComplete: function () {
		let browserName, browserVersion;
		const capabilities = browser.getCapabilities();
		capabilities.then((caps) => {
			browserName = caps.get('browserName');
			browserVersion = caps.get('version');

			testConfig = {
				reportTitle: 'Curity Web UI E2e Testing Report',
				outputPath: './e2e/reports',
				screenshotPath: 'screenshots',
				testBrowser: browserName,
				browserVersion: browserVersion,
				modifiedSuiteName: false,
				screenshotsOnlyOnFailure: true
			};
			new HTMLReport().from('./e2e/spec_results/spec_xml_results.xml', testConfig);
		});
	}
};
