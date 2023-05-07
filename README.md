# Setup

## Installation

## AWS Credentials

To get your AWS credentials (access key and secret key), follow these steps:

1. Sign in to the [AWS Management Console](https://aws.amazon.com/console/).
2. Click on the "Services" dropdown at the top-left corner, and under the "Security, Identity, & Compliance" section, click on "IAM" (Identity and Access Management).
3. In the IAM dashboard, click on "Users" in the left-hand side menu.
4. Click on the "Add user" button to create a new user or select an existing user if you want to use their credentials.
   - If you are creating a new user:
     1. Enter a username.
     2. In the "Access type" section, select "Programmatic access" to enable an access key and a secret key for the user.
     3. Click "Next: Permissions".
     4. Attach the required permissions or policies for Amazon Polly (e.g., `AmazonPollyFullAccess`) to the user. You can either attach existing policies directly or add the user to a group with the required policies.
     5. Review the user details and click "Create user".
5. After creating the user, you will see a "Success" screen, where you can view and download the access key and secret key.
   - **Important:** The secret key will be shown only once. Be sure to copy it, save it, or download the `.csv` file containing the keys. If you lose the secret key, you will have to create new credentials.

Once you have your access key and secret key, you can set up your AWS SDK for JavaScript by configuring the `~/.aws/credentials` file as described in the previous answer.

Remember to follow best practices for managing AWS credentials, such as using IAM roles for Amazon EC2 instances or AWS Lambda functions, rotating credentials regularly, and not sharing or hardcoding credentials in your code.

## Saving AWS Credentials

To set up the credentials file on macOS, follow these steps:

1. Open Terminal on your Mac.
2. Check if the `.aws` directory exists in your home folder by running:
   ```
   ls -la ~ | grep .aws
   ```
   If it doesn't exist, create it using:
   ```
   mkdir ~/.aws
   ```
3. Navigate to the `.aws` directory:
   ```
   cd ~/.aws
   ```
4. Create a new file named `credentials` or open it if it exists using your preferred text editor. For example, you can use the `nano` text editor:
   ```
   nano credentials
   ```
5. Add your AWS access key and secret key to the file in the following format:
   ```
   [default]
   aws_access_key_id = YOUR_ACCESS_KEY
   aws_secret_access_key = YOUR_SECRET_KEY
   ```
   Replace `YOUR_ACCESS_KEY` and `YOUR_SECRET_KEY` with your actual AWS access key and secret key. If you want to use a different profile name instead of `default`, you can replace `[default]` with `[your-profile-name]`.
6. Save the changes and exit the text editor. In `nano`, press `Ctrl + X`, then press `Y`, and finally press `Enter`.
7. To ensure that the AWS SDK can access the credentials file, set the appropriate permissions:
   ```
   chmod 600 ~/.aws/credentials
   ```

After completing these steps, the AWS SDK for JavaScript should automatically use the credentials stored in the `~/.aws/credentials` file when making requests to AWS services like Amazon Polly.
