require 'html-proofer'

task default: %w[test]

task :test do
  HTMLProofer.check_directory("./_site").run
end
