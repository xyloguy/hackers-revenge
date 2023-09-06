class ApplicationController < ActionController::API
  def success
    render :json => { :success => true }
  end

private

  def mxmax_event?
    request.headers["X-HackersRevenge-Event"] == "mxmax"
  end

  def show_real_names?
    true # mxmax_event?
  end
end
