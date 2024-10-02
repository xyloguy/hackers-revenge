class ApplicationController < ActionController::API
  def success
    render :json => { :success => true }
  end

private

  def mxmax_event?
    true
  end

end
