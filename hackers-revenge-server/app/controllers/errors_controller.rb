class ErrorsController < ActionController::API
  def bad_request
    render :json => { :error => "Bad Request" }, :status => :bad_request
  end

  def not_found
    render :json => { :error => "Not Found" }, :status => :not_found
  end

  def not_implemented
    render :json => { :error => "Not Implemented" }, :status => :not_implemented
  end

  def teapot
    render :json => { :error => "I'm a teapot" }, :status => 418
  end

  def unknown_error
    render :json => { :error => "Unknown Error" }, :status => :internal_server_error
  end
end
