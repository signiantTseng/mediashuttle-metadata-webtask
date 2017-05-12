# Media Shuttle Metadata Sample Form

Sample code demonstrating how to set up a Metadata collection form for Media Shuttle using [Webtask](https://webtask.io).

Replace the registration key placeholder with the registration key generated for your portal in the Media Shuttle portal admin console.

Create a webtask using the webtask command line interface:

```bash
$ wt create https://github.com/tporter-signiant/mediashuttle-metadata-webtask/blob/master/form.js

Webtask created

You can access your webtask at the following url:

https://wt-2117b4787cc0e883d5d156f357f376fa-0.run.webtask.io/form
```
Then set the Metadata provider URL in the Media Shuttle portal admin console to the /show path under the URL assigned to your webtask:

Using the above webtask url as an example, the Metadata provider URL would be:

https://wt-2117b4787cc0e883d5d156f357f376fa-0.run.webtask.io/form/show
