<h1><i class="fa fa-file-archive-o"></i> JWT Setup</h1>
<hr />

<form class="jwt">
    <div class="form-group">
        <p>
            Enter the domain for the cookie (ie: .yoursite.com)
        </p>
        <input type="text" name="cookiedomain" title="Cookie Domain" class="form-control" placeholder="Cookie Domain">
        <p class="help-block">
            The domain to write the cookie in, usually the root domain with a leading "." so that it can be read by subdomains.
        </p>
        <br />
        <p>
            Enter the name of your cookie.
        </p>
        <input type="text" name="cookiename" title="Cookie Name" class="form-control" placeholder="Cookie Name">
        <p class="help-block">
            The name of the cookie that will be saved.
        </p>
        <br />
        <p>
            How long is the cookie valid (in seconds).
        </p>
        <input type="text" name="cookielifetime" title="Cookie Lifetime" class="form-control" placeholder="Cookie Lifetime">
        <p class="help-block">
            Number of seconds that the cookie will be good for.
        </p>
        <br />
        <p>
            Enter your application shared secret details here.
        </p>
        <input type="text" name="secret" title="Shared Secret" class="form-control" placeholder="Shared Secret">
        <p class="help-block">
            This will be used to sign the JWT.
        </p>
    </div>
</form>
<button class="btn btn-lg btn-primary" type="button" id="save">Save</button>
